
import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, unit }) => {
    return (
        <div className="group relative p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10">
             <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-400 transition-all duration-300 ease-in-out"></div>
            <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900 dark:to-cyan-900 text-emerald-500 dark:text-cyan-400 p-3 rounded-full">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {value} <span className="text-base font-medium text-slate-600 dark:text-slate-300">{unit}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
