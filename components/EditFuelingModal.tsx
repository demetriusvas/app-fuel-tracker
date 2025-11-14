import React, { useState, useEffect } from 'react';
import type { FuelingEntry, EditableFuelingData } from '../types';
import { X } from 'lucide-react';

interface EditFuelingModalProps {
    fueling: FuelingEntry;
    onClose: () => void;
    onSave: (data: EditableFuelingData) => void;
    lastOdometer: number;
}

export const EditFuelingModal: React.FC<EditFuelingModalProps> = ({ fueling, onClose, onSave, lastOdometer }) => {
    const [date, setDate] = useState(fueling.date);
    const [odometer, setOdometer] = useState(fueling.odometer.toString());
    const [pricePerLiter, setPricePerLiter] = useState(fueling.pricePerLiter.toString());
    const [totalCost, setTotalCost] = useState(fueling.totalCost.toString());
    const [station, setStation] = useState(fueling.station || '');

    useEffect(() => {
        // Reset state if fueling prop changes
        setDate(fueling.date);
        setOdometer(fueling.odometer.toString());
        setPricePerLiter(fueling.pricePerLiter.toString());
        setTotalCost(fueling.totalCost.toString());
        setStation(fueling.station || '');
    }, [fueling]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const odometerNum = parseFloat(odometer);
        if (odometerNum <= lastOdometer) {
          alert(`O odômetro deve ser maior que o registro anterior (${lastOdometer} km).`);
          return;
        }

        onSave({
            id: fueling.id,
            date,
            odometer: odometerNum,
            pricePerLiter: parseFloat(pricePerLiter),
            totalCost: parseFloat(totalCost),
            station,
        });
    };

    const isFormValid = odometer && pricePerLiter && totalCost && parseFloat(odometer) > 0 && parseFloat(pricePerLiter) > 0 && parseFloat(totalCost) > 0;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            <div className="relative max-w-lg w-full m-4">
                 <div className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Fechar modal"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Editar Abastecimento</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="edit-date" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Data</label>
                            <input type="date" id="edit-date" value={date} onChange={e => setDate(e.target.value)} required 
                                   className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                        </div>
                        <div>
                            <label htmlFor="edit-odometer" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Odômetro (km)</label>
                            <input type="number" id="edit-odometer" value={odometer} onChange={e => setOdometer(e.target.value)} required min={lastOdometer + 1} step="0.1" 
                                   className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                        </div>
                        <div>
                            <label htmlFor="edit-pricePerLiter" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Preço por Litro (R$)</label>
                            <input type="number" id="edit-pricePerLiter" value={pricePerLiter} onChange={e => setPricePerLiter(e.target.value)} required min="0" step="0.001"
                                   className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                        </div>
                         <div>
                            <label htmlFor="edit-totalCost" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Valor Total (R$)</label>
                            <input type="number" id="edit-totalCost" value={totalCost} onChange={e => setTotalCost(e.target.value)} required min="0" step="0.01"
                                   className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                        </div>
                         <div>
                            <label htmlFor="edit-station" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Posto (Opcional)</label>
                            <input type="text" id="edit-station" value={station} onChange={e => setStation(e.target.value)}
                                   className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"/>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose}
                                    className="text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                                Cancelar
                            </button>
                             <button type="submit" disabled={!isFormValid}
                                    className="text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};