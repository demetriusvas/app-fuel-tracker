import React, { useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { FuelingEntry, NewFuelingData } from '../types';
import { StatsCard } from '../components/StatsCard';
import { FuelingForm } from '../components/FuelingForm';
import { FuelingHistory } from '../components/FuelingHistory';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { Droplet, Gauge, DollarSign, Route } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [fuelings, setFuelings] = useLocalStorage<FuelingEntry[]>('fuelings', []);

    const handleAddFueling = useCallback((data: NewFuelingData) => {
        const sortedFuelings = [...fuelings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.odometer - b.odometer);
        const lastFueling = sortedFuelings.length > 0 ? sortedFuelings[sortedFuelings.length - 1] : null;

        let consumption: number | null = null;
        if (lastFueling && data.odometer > lastFueling.odometer) {
            const distance = data.odometer - lastFueling.odometer;
            const liters = data.totalCost / data.pricePerLiter;
            if (liters > 0) {
                consumption = distance / liters;
            }
        }

        const newEntry: FuelingEntry = {
            id: new Date().toISOString() + Math.random(),
            date: data.date,
            odometer: data.odometer,
            pricePerLiter: data.pricePerLiter,
            totalCost: data.totalCost,
            liters: data.totalCost / data.pricePerLiter,
            station: data.station,
            consumption: consumption,
        };

        setFuelings(prev => [...prev, newEntry]);
    }, [fuelings, setFuelings]);

    const handleDeleteFueling = useCallback((id: string) => {
        setFuelings(prev => prev.filter(f => f.id !== id));
    }, [setFuelings]);

    const stats = useMemo(() => {
        const sorted = [...fuelings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (sorted.length < 2) {
            return {
                avgConsumption: 0,
                totalSpent: sorted.reduce((acc, curr) => acc + curr.totalCost, 0),
                totalLiters: sorted.reduce((acc, curr) => acc + curr.liters, 0),
                totalDistance: 0,
            };
        }

        const validFuelings = sorted.filter(f => f.consumption != null && f.consumption > 0);
        const totalConsumption = validFuelings.reduce((acc, f) => acc + f.consumption!, 0);
        const avgConsumption = validFuelings.length > 0 ? totalConsumption / validFuelings.length : 0;

        const totalSpent = sorted.reduce((acc, curr) => acc + curr.totalCost, 0);
        const totalLiters = sorted.reduce((acc, curr) => acc + curr.liters, 0);
        const totalDistance = sorted[sorted.length - 1].odometer - sorted[0].odometer;

        return {
            avgConsumption,
            totalSpent,
            totalLiters,
            totalDistance
        };
    }, [fuelings]);
    
    const sortedFuelingsForDisplay = useMemo(() => 
        [...fuelings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.odometer - a.odometer),
    [fuelings]);


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
                <div className="lg:col-span-2">
                    <ConsumptionChart data={sortedFuelingsForDisplay} />
                </div>
            </div>

            <FuelingHistory fuelings={sortedFuelingsForDisplay} onDeleteFueling={handleDeleteFueling} />
        </div>
    );
};
