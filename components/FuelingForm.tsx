
import React, { useState } from 'react';
import type { NewFuelingData } from '../types';
import { PlusCircle } from 'lucide-react';

interface FuelingFormProps {
    onAddFueling: (data: NewFuelingData) => void;
    lastOdometer: number;
}

export const FuelingForm: React.FC<FuelingFormProps> = ({ onAddFueling, lastOdometer }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [odometer, setOdometer] = useState('');
    const [pricePerLiter, setPricePerLiter] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [station, setStation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const odometerNum = parseFloat(odometer);
        if (odometerNum <= lastOdometer) {
          alert(`O odômetro deve ser maior que o último registro (${lastOdometer} km).`);
          return;
        }
        
        onAddFueling({
            date,
            odometer: odometerNum,
            pricePerLiter: parseFloat(pricePerLiter),
            totalCost: parseFloat(totalCost),
            station,
        });

        // Reset form
        setOdometer('');
        setPricePerLiter('');
        setTotalCost('');
        setStation('');
    };

    const isFormValid = odometer && pricePerLiter && totalCost && parseFloat(odometer) > 0 && parseFloat(pricePerLiter) > 0 && parseFloat(totalCost) > 0;

    return (
        <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle className="text-emerald-500" />
                Adicionar Abastecimento
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Data</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required 
                           className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                </div>
                <div>
                    <label htmlFor="odometer" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Odômetro (km)</label>
                    <input type="number" id="odometer" value={odometer} onChange={e => setOdometer(e.target.value)} required min={lastOdometer + 1} step="0.1" placeholder={`${lastOdometer}`}
                           className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                </div>
                <div>
                    <label htmlFor="pricePerLiter" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Preço por Litro (R$)</label>
                    <input type="number" id="pricePerLiter" value={pricePerLiter} onChange={e => setPricePerLiter(e.target.value)} required min="0" step="0.001" placeholder="5.89"
                           className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                </div>
                 <div>
                    <label htmlFor="totalCost" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Valor Total (R$)</label>
                    <input type="number" id="totalCost" value={totalCost} onChange={e => setTotalCost(e.target.value)} required min="0" step="0.01" placeholder="250.00"
                           className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                </div>
                 <div>
                    <label htmlFor="station" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Posto (Opcional)</label>
                    <input type="text" id="station" value={station} onChange={e => setStation(e.target.value)} placeholder="Posto Shell"
                           className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                </div>
                <button type="submit" disabled={!isFormValid}
                        className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900">
                    Registrar
                </button>
            </form>
        </div>
    );
};
