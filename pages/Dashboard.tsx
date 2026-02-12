
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { FuelingEntry, NewFuelingData } from '../types';
import { StatsCard } from '../components/StatsCard';
import { FuelingForm } from '../components/FuelingForm';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { Droplet, Gauge, DollarSign, Route, Loader2, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { MonthlySpendChart } from '../components/MonthlySpendChart';

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

export const Dashboard: React.FC = () => {
    const [fuelings, setFuelings] = useState<FuelingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        setError(null);
        
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
            setError("Erro de permissão ou conexão com o banco de dados. Verifique as regras do Firestore.");
            setLoading(false);
        });

        return () => unsubscribeFirestore();
    }, [currentUser]);

    const handleAddFueling = useCallback(async (data: NewFuelingData) => {
        if (!currentUser) return;
        try {
            const newEntryRaw = {
                ...data,
                userId: currentUser.uid,
                liters: data.totalCost / data.pricePerLiter,
                consumption: null,
            };
            await addDoc(collection(db, "fuelings"), newEntryRaw);
        } catch (err) {
            console.error("Error adding fueling:", err);
            alert("Erro ao salvar: Verifique se você tem permissão no Firestore.");
        }
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
            {error && (
                <div className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
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
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ConsumptionChart data={sortedFuelingsForDisplay} />
                    <MonthlySpendChart data={fuelings} />
                </div>
            </div>
        </div>
    );
};
