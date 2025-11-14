import React from 'react';
import { GoogleIcon } from '../components/GoogleIcon';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
    onLogin: () => void;
    onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form validation and API calls
        // For this simulation, we'll just call the onLogin prop
        onLogin();
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="relative text-center">
                    <button 
                        onClick={onBack} 
                        className="absolute -top-4 left-0 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors"
                        aria-label="Voltar para a página inicial"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                        Acesse sua conta
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        e comece a economizar agora mesmo.
                    </p>
                </div>
                <div className="p-8 space-y-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Endereço de e-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="voce@exemplo.com"
                                    className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Sua senha"
                                    className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                Ou continue com
                            </span>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={onLogin} // Simulate login for Google as well
                            className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
                        >
                            <GoogleIcon className="h-5 w-5" />
                            <span>Entrar com Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};