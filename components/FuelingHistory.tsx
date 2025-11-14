
import React from 'react';
import type { FuelingEntry } from '../types';
import { Trash2, Edit } from 'lucide-react';

interface FuelingHistoryProps {
    fuelings: FuelingEntry[];
    onDeleteFueling: (id: string) => void;
    onEditFueling: (fueling: FuelingEntry) => void;
}

export const FuelingHistory: React.FC<FuelingHistoryProps> = ({ fuelings, onDeleteFueling, onEditFueling }) => {
    return (
        <div className="p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Histórico de Abastecimentos</h2>
            <div className="overflow-x-auto">
                {fuelings.length === 0 ? (
                     <p className="text-center py-8 text-slate-500 dark:text-slate-400">Nenhum abastecimento registrado ainda.</p>
                ) : (
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Odômetro</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor / Litro</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Consumo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">Posto</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {fuelings.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{new Date(f.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">{f.odometer.toLocaleString('pt-BR')} km</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                                  <div>R$ {f.pricePerLiter.toFixed(2)}</div>
                                  <div className="text-xs text-slate-400">Total: R$ {f.totalCost.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {f.consumption ? 
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{f.consumption.toFixed(2)} km/l</span> : 
                                        <span className="text-slate-400 dark:text-slate-500">-</span>
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300 hidden md:table-cell">{f.station || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
                                    <button onClick={() => onEditFueling(f)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => onDeleteFueling(f.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
};