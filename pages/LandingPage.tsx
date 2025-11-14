import React from 'react';
import { BarChart2, List, Edit, ArrowRight, Droplet } from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const features = [
    {
        icon: <BarChart2 className="h-8 w-8 text-emerald-500" />,
        title: 'Análise de Consumo',
        description: 'Visualize a eficiência do seu veículo com gráficos intuitivos e detalhados.',
    },
    {
        icon: <List className="h-8 w-8 text-cyan-500" />,
        title: 'Histórico Detalhado',
        description: 'Mantenha todos os seus registros de abastecimento organizados e acessíveis.',
    },
    {
        icon: <Edit className="h-8 w-8 text-amber-500" />,
        title: 'Lançamento Fácil',
        description: 'Adicione novos abastecimentos em segundos com nosso formulário simples e rápido.',
    },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 text-slate-800 dark:text-slate-100">
              Controle seus gastos com
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 gradient-text">
                combustível de forma inteligente.
              </span>
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 mt-6 text-lg text-slate-600 dark:text-slate-300">
              Fuel Tracker é a ferramenta definitiva para motoristas que desejam otimizar custos,
              monitorar o consumo e entender o desempenho do seu veículo.
            </p>
            <button
              onClick={onNavigateToLogin}
              className="mt-10 inline-flex items-center gap-2 text-white font-bold text-lg py-4 px-8 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900"
            >
              Acessar Dashboard
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Image Placeholder 1: Chart Mockup */}
          <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm">
             <h3 className="font-bold text-lg mb-4 ml-4 text-slate-700 dark:text-slate-200">Evolução do Consumo (km/l)</h3>
             <div className="w-full h-64">
                <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <line x1="10" y1="30" x2="290" y2="30" stroke="currentColor" strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <line x1="10" y1="70" x2="290" y2="70" stroke="currentColor" strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <line x1="10" y1="110" x2="290" y2="110" stroke="currentColor" strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <path d="M 10 90 C 50 40, 70 120, 110 80 S 170 20, 210 60 S 260 100, 290 50" fill="none" stroke="#34d399" strokeWidth="3" />
                    <path d="M 10 90 C 50 40, 70 120, 110 80 S 170 20, 210 60 S 260 100, 290 50 L 290 150 L 10 150 Z" fill="url(#chartGradient)" />
                </svg>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-white/40 dark:bg-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Tudo que você precisa em um só lugar
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                   Monitore, analise e economize com nossas ferramentas poderosas.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature) => (
                    <div 
                        key={feature.title} 
                        className="group relative p-8 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-cyan-500/10"
                    >
                         <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-400 transition-all duration-300 ease-in-out"></div>
                        <div className="flex flex-col items-start">
                           <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900 dark:to-cyan-900 p-4 rounded-xl mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Image Placeholder 2: History List Mockup */}
            <div className="mt-20 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm max-w-4xl mx-auto">
                <h3 className="font-bold text-lg mb-4 text-slate-700 dark:text-slate-200">Histórico de Abastecimentos</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full"><Droplet className="h-5 w-5 text-emerald-500" /></div>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">25 de Julho, 2024</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Posto Shell</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">12.8 km/l</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">R$ 250,00</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full"><Droplet className="h-5 w-5 text-emerald-500" /></div>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">10 de Julho, 2024</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Posto Ipiranga</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">12.5 km/l</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">R$ 245,50</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg opacity-60">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full"><Droplet className="h-5 w-5 text-emerald-500" /></div>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">28 de Junho, 2024</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Posto BR</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">12.2 km/l</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">R$ 261,30</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};