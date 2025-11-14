import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FuelingEntry, NewFuelingData, EditableFuelingData } from '../types';
import { StatsCard } from '../components/StatsCard';
import { FuelingForm } from '../components/FuelingForm';
import { FuelingHistory } from '../components/FuelingHistory';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { Droplet, Gauge, DollarSign, Route, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { EditFuelingModal } from '../components/EditFuelingModal';
import { User } from 'firebase/auth';

const recalculateConsumptions = (fuelings: FuelingEntry[]): FuelingEntry[] => {
    const sorted = [...fuelings].sort((a, b) => a.odometer - b.odometer);
    return sorted.map((current, index) => {
        if (index === 0) {
            return { ...current, consumption: null };
        }
        const previous = sorted[index - 1];
        const distance = current.odometer - previous.odometer;
        const liters = current.liters;
        if (liters > 0 && distance > 0) {
            return { ...current, consumption: distance / liters };
        }
        return { ...current, consumption: null };
    });
};

export const Dashboard: React.FC = () => {
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

    const handleBatchUpdate = async (updatedFuelings: FuelingEntry[]) => {
        const batch = writeBatch(db);
        updatedFuelings.forEach(f => {
            const docRef = doc(db, "fuelings", f.id);
            batch.update(docRef, { consumption: f.consumption });
        });
        await batch.commit();
    };

    const handleAddFueling = useCallback(async (data: NewFuelingData) => {
        if (!currentUser) return;

        const newEntryRaw = {
            ...data,
            userId: currentUser.uid,
            liters: data.totalCost / data.pricePerLiter,
            consumption: null, // Será recalculado
        };
        
        const tempFuelings = [...fuelings, { ...newEntryRaw, id: 'temp' }];
        const recalculated = recalculateConsumptions(tempFuelings);
        
        const newEntryWithConsumption = recalculated.find(f => f.id === 'temp');

        const docRef = await addDoc(collection(db, "fuelings"), {
            ...newEntryRaw,
            consumption: newEntryWithConsumption?.consumption ?? null,
        });

        // Após adicionar, precisamos recalcular e atualizar o abastecimento seguinte, se houver.
        const allFuelingsAfterAdd = [...fuelings, { ...newEntryRaw, id: docRef.id, consumption: newEntryWithConsumption?.consumption ?? null }];
        const finalRecalculatedList = recalculateConsumptions(allFuelingsAfterAdd);
        await handleBatchUpdate(finalRecalculatedList);

    }, [fuelings, currentUser]);

    const handleDeleteFueling = useCallback(async (id: string) => {
        await deleteDoc(doc(db, "fuelings", id));
        // A remoção irá acionar o onSnapshot, que recalculará tudo.
    }, []);
    
    const handleUpdateFueling = useCallback(async (updatedData: EditableFuelingData) => {
        const docRef = doc(db, "fuelings", updatedData.id);
        const batch = writeBatch(db);
        
        const updatedEntry = {
            ...updatedData,
            liters: updatedData.totalCost / updatedData.pricePerLiter,
        };

        batch.update(docRef, updatedEntry);
        
        // Recalcular toda a lista com o dado atualizado
        const otherFuelings = fuelings.filter(f => f.id !== updatedData.id);
        const fullListWithUpdate = [...otherFuelings, { ...fuelings.find(f=>f.id === updatedData.id)!, ...updatedEntry }];
        const recalculated = recalculateConsumptions(fullListWithUpdate);

        recalculated.forEach(f => {
             const ref = doc(db, "fuelings", f.id);
             batch.update(ref, { consumption: f.consumption });
        });
        
        await batch.commit();
        setEditingFueling(null);
    }, [fuelings]);


    const stats = useMemo(() => {
        const sorted = [...fuelings].sort((a, b) => a.odometer - b.odometer);
        if (sorted.length < 1) {
            return { avgConsumption: 0, totalSpent: 0, totalLiters: 0, totalDistance: 0 };
        }

        const validFuelings = sorted.filter(f => f.consumption != null && f.consumption > 0);
        const totalConsumption = validFuelings.reduce((acc, f) => acc + f.consumption!, 0);
        const avgConsumption = validFuelings.length > 0 ? totalConsumption / validFuelings.length : 0;

        const totalSpent = sorted.reduce((acc, curr) => acc + curr.totalCost, 0);
        const totalLiters = sorted.reduce((acc, curr) => acc + curr.liters, 0);
        const totalDistance = sorted.length > 1 ? sorted[sorted.length - 1].odometer - sorted[0].odometer : 0;

        return { avgConsumption, totalSpent, totalLiters, totalDistance };
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
                        sortedFuelingsForDisplay
                            .filter(f => f.id !== editingFueling.id && f.odometer < editingFueling.odometer)
                            .sort((a, b) => b.odometer - a.odometer)[0]?.odometer ?? 0
                    }
                />
            )}
            <section id="stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard icon={<Gauge />} label="Consumo Médio" value={stats.avgConsumption.toFixed(2)} unit="km/l" />
                <StatsCard icon={<DollarSign />} label="Total Gasto" value={stats.totalSpent.toFixed(2)} unit="R$" />
                <StatsCard icon={<Droplet />} label="Total Abastecido" value={stats.totalLiters.toFixed(2)} unit="litros" />
                <StatsCard icon={<Route />} label="Distância Total" value={stats.totalDistance.toLocaleString('pt-BR')} unit="km" />
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-1">
                    <FuelingForm onAddFueling={handleAddFueling} lastOdometer={sortedFuelingsForDisplay[0]?.odometer ?? 0} />
                </div>
                <div className="lg:col-span-2">
                    <ConsumptionChart data={sortedFuelingsForDisplay} />
                </div>
            </div>

            <FuelingHistory fuelings={sortedFuelingsForDisplay} onDeleteFueling={handleDeleteFueling} onEditFueling={setEditingFueling} />
        </div>
    );
};