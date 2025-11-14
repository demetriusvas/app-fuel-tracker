import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FuelingEntry } from '../types';

interface MonthlySpendChartProps {
    data: FuelingEntry[];
}

// Gradient for the bar chart
const Gradient = () => (
    <defs>
        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#34d399" stopOpacity={0.8}/>
        </linearGradient>
    </defs>
);

export const MonthlySpendChart: React.FC<MonthlySpendChartProps> = ({ data }) => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const colors = {
        grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        text: isDarkMode ? '#cbd5e1' : '#475569',
        tooltipBg: isDarkMode ? '#1e293b' : '#ffffff',
        tooltipBorder: isDarkMode ? '#334155' : '#e2e8f0',
    };

    const chartData = useMemo(() => {
        const monthlySpend: { [key: string]: number } = {};
        
        data.forEach(entry => {
            const date = new Date(entry.date);
            // Fix timezone issues by working with UTC dates
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth(); // 0-11
            const key = `${year}-${String(month).padStart(2, '0')}`;
            
            if (!monthlySpend[key]) {
                monthlySpend[key] = 0;
            }
            monthlySpend[key] += entry.totalCost;
        });

        const formattedData = Object.keys(monthlySpend).map(key => {
            const [year, month] = key.split('-').map(Number);
            const date = new Date(Date.UTC(year, month, 1));
            const monthName = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });

            return {
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                "Gasto Total": parseFloat(monthlySpend[key].toFixed(2)),
                sortKey: key,
            };
        });

        return formattedData.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    }, [data]);

    if (chartData.length < 1) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">Sem dados suficientes para exibir o gráfico de gastos mensais.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-4 ml-4">Gastos Mensais (R$)</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <Gradient />
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                    <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ 
                            backgroundColor: colors.tooltipBg, 
                            border: `1px solid ${colors.tooltipBorder}`,
                            borderRadius: '0.75rem' 
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                        formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Gasto Total']}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="Gasto Total" fill="url(#colorSpend)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
