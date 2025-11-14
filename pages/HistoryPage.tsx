import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FuelingEntry, EditableFuelingData } from '../types';
import { FuelingHistory } from '../components/FuelingHistory';
import { Loader2, ArrowLeft } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { EditFuelingModal } from '../components/EditFuelingModal';
import { User } from 'firebase/auth';

interface HistoryPageProps {
    onNavigateToDashboard: () => void;
}

const recalculateConsumptions = (fuelings: FuelingEntry[]): FuelingEntry[] => {
    // Sort by odometer to ensure correct chronological order
    const sorted = [...fuelings].sort((a, b) => a.odometer - b.odometer);

    // The consumption for a given fill-up (entry `i`) can only be calculated 
    // after the next fill-up (entry `i+1`).
    return sorted.map((current, index) => {
        const next = sorted[index + 1];

        // If there's no next entry, we're at the most recent fill-up.
        // Consumption can't be calculated yet.
        if (!next) {
            return { ...current, consumption: null };
        }

        // Distance traveled on the fuel from the 'current' fill-up.
        const distance = next.odometer - current.odometer;
        // Fuel used was the amount from the 'current' fill-up.
        const liters = current.liters;

        if (liters > 0 && distance > 0) {
            return { ...current, consumption: distance / liters };
        }

        // If data is invalid (e.g., negative distance), consumption is null.
        return { ...current, consumption: null };
    });
};


export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigateToDashboard }) => {
    const [fuelings, setFuelings] = useState<FuelingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
    const [editingFueling, setEditingFueling] = useState<FuelingEntry | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (!user) {
                setFuelings([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);
        const q = query(collection(db, "fuelings"), where("userId", "==", currentUser.uid));
        
        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
            const userFuelings: FuelingEntry[] = [];
            querySnapshot.forEach((doc) => {
                userFuelings.push({ id: doc.id, ...doc.data() } as FuelingEntry);
            });
            const recalculated = recalculateConsumptions(userFuelings);
            setFuelings(recalculated);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching fuelings:", error);
            setLoading(false);
        });

        return () => unsubscribeFirestore();
    }, [currentUser]);

    const handleDeleteFueling = useCallback(async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            await deleteDoc(doc(db, "fuelings", id));
            // onSnapshot will automatically trigger a recalculation for the list
        }
    }, []);
    
    const handleUpdateFueling = useCallback(async (updatedData: EditableFuelingData) => {
        const originalFueling = fuelings.find(f => f.id === updatedData.id);
        if (!originalFueling) return;
        
        const batch = writeBatch(db);
        
        const updatedEntryData = {
            ...updatedData,
            liters: updatedData.totalCost / updatedData.pricePerLiter,
        };
        // Update the main document with all user-editable fields
        const docRef = doc(db, "fuelings", updatedData.id);
        batch.update(docRef, {
             date: updatedEntryData.date,
             odometer: updatedEntryData.odometer,
             pricePerLiter: updatedEntryData.pricePerLiter,
             totalCost: updatedEntryData.totalCost,
             station: updatedEntryData.station,
             liters: updatedEntryData.liters,
        });

        // The onSnapshot listener will handle recalculating consumptions for the whole list,
        // which is safer and ensures consistency after an odometer change.
        await batch.commit();
        setEditingFueling(null);
    }, [fuelings]);
    
    const sortedFuelingsForDisplay = useMemo(() => 
        [...fuelings].sort((a, b) => b.odometer - a.odometer),
    [fuelings]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-10 w-10 text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {editingFueling && (
                <EditFuelingModal 
                    fueling={editingFueling}
                    onClose={() => setEditingFueling(null)}
                    onSave={handleUpdateFueling}
                    lastOdometer={
                        fuelings
                            .filter(f => f.id !== editingFueling.id && f.odometer < editingFueling.odometer)
                            .sort((a, b) => b.odometer - a.odometer)[0]?.odometer ?? 0
                    }
                />
            )}

            <div className="mb-8 flex items-center gap-4">
                 <button 
                    onClick={onNavigateToDashboard} 
                    className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label="Voltar para o dashboard"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Histórico Completo</h1>
            </div>

            <FuelingHistory fuelings={sortedFuelingsForDisplay} onDeleteFueling={handleDeleteFueling} onEditFueling={setEditingFueling} />
        </div>
    );
};