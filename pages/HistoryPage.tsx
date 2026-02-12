
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FuelingEntry, EditableFuelingData } from '../types';
import { FuelingHistory } from '../components/FuelingHistory';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { EditFuelingModal } from '../components/EditFuelingModal';
import { User } from 'firebase/auth';

const recalculateConsumptions = (fuelings: FuelingEntry[]): FuelingEntry[] => {
    const sorted = [...fuelings].sort((a, b) => a.odometer - b.odometer);
    return sorted.map((current, index) => {
        const next = sorted[index + 1];
        if (!next) return { ...current, consumption: null };
        const distance = next.odometer - current.odometer;
        const liters = current.liters;
        if (liters > 0 && distance > 0) return { ...current, consumption: distance / liters };
        return { ...current, consumption: null };
    });
};

export const HistoryPage: React.FC<{ onNavigateToDashboard: () => void }> = ({ onNavigateToDashboard }) => {
    const [fuelings, setFuelings] = useState<FuelingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        }, (err) => {
            console.error("Firestore error:", err);
            setError("Erro de permissão ao carregar histórico.");
            setLoading(false);
        });
        return () => unsubscribeFirestore();
    }, [currentUser]);

    const handleDeleteFueling = useCallback(async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este registro?")) {
            try {
                await deleteDoc(doc(db, "fuelings", id));
            } catch (err) {
                console.error("Delete error:", err);
                alert("Você não tem permissão para excluir este registro.");
            }
        }
    }, []);
    
    const handleUpdateFueling = useCallback(async (updatedData: EditableFuelingData) => {
        try {
            const batch = writeBatch(db);
            const docRef = doc(db, "fuelings", updatedData.id);
            batch.update(docRef, {
                 date: updatedData.date,
                 odometer: updatedData.odometer,
                 pricePerLiter: updatedData.pricePerLiter,
                 totalCost: updatedData.totalCost,
                 station: updatedData.station,
                 liters: updatedData.totalCost / updatedData.pricePerLiter,
            });
            await batch.commit();
            setEditingFueling(null);
        } catch (err) {
            console.error("Update error:", err);
            alert("Erro ao atualizar: Verifique suas permissões.");
        }
    }, []);
    
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
            {error && (
                <div className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            )}
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
                 <button onClick={onNavigateToDashboard} className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Histórico Completo</h1>
            </div>
            <FuelingHistory fuelings={sortedFuelingsForDisplay} onDeleteFueling={handleDeleteFueling} onEditFueling={setEditingFueling} />
        </div>
    );
};
