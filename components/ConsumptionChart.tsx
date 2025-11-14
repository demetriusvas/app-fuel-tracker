
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FuelingEntry } from '../types';

interface ConsumptionChartProps {
    data: FuelingEntry[];
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
    const chartData = data
        .filter(entry => entry.consumption != null)
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
            Consumo: parseFloat(entry.consumption!.toFixed(2)),
            odometer: entry.odometer,
        }))
        .sort((a, b) => a.odometer - b.odometer);

    // Using tailwind colors from config would be ideal, but for CDN that's not possible easily.
    // We get the theme from the html element.
    const isDarkMode = document.documentElement.classList.contains('dark');
    const colors = {
        grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        text: isDarkMode ? '#cbd5e1' : '#475569',
        tooltipBg: isDarkMode ? '#1e293b' : '#ffffff',
        tooltipBorder: isDarkMode ? '#334155' : '#e2e8f0',
        line: '#34d399', // emerald-400
    };

    if (chartData.length < 2) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">Dados insuficientes para exibir o gráfico de consumo.</p>
            </div>
        );
    }
    
    return (
        <div className="h-full min-h-[400px] p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-4 ml-4">Evolução do Consumo (km/l)</h3>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                    <XAxis dataKey="date" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: colors.tooltipBg, 
                            border: `1px solid ${colors.tooltipBorder}`,
                            borderRadius: '0.75rem' 
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line type="monotone" dataKey="Consumo" stroke={colors.line} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
