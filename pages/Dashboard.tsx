import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FuelingEntry, NewFuelingData } from '../types';
import { StatsCard } from '../components/StatsCard';
import { FuelingForm } from '../components/FuelingForm';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { Droplet, Gauge, DollarSign, Route, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, doc, writeBatch } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { MonthlySpendChart } from '../components/MonthlySpendChart';

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

export const Dashboard: React.FC = () => {
    const [fuelings, setFuelings] = useState<FuelingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

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
        if (updatedFuelings.length === 0) return;
        const batch = writeBatch(db);
        updatedFuelings.forEach(f => {
            if (f.id) { // Ensure there is an id
                const docRef = doc(db, "fuelings", f.id);
                batch.update(docRef, { consumption: f.consumption });
            }
        });
        await batch.commit();
    };

    const handleAddFueling = useCallback(async (data: NewFuelingData) => {
        if (!currentUser) return;

        const newEntryRaw = {
            ...data,
            userId: currentUser.uid,
            liters: data.totalCost / data.pricePerLiter,
            consumption: null, // Consumption is always null on creation now
        };
        
        // Add the new document to Firestore first to get its ID
        const docRef = await addDoc(collection(db, "fuelings"), newEntryRaw);

        // After adding, we need to recalculate and potentially update the consumption
        // of the PREVIOUS entry. The `onSnapshot` listener will handle this by
        // re-fetching and re-calculating the entire list, which is simpler and safer.

    }, [currentUser]);


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
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ConsumptionChart data={sortedFuelingsForDisplay} />
                    <MonthlySpendChart data={fuelings} />
                </div>
            </div>
        </div>
    );
};