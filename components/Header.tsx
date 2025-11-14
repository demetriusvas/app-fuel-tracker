import React from 'react';
import { Sun, Moon, Fuel, LogOut, LogIn } from 'lucide-react';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
    onNavigateToLogin: () => void;
    onNavigateToHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, isLoggedIn, onLogout, onNavigateToLogin, onNavigateToHistory }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Fuel className="h-8 w-8 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white p-1 rounded-md"/>
                        <span className="ml-3 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
                           Fuel Tracker
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Show history link first only if logged in */}
                        {isLoggedIn && (
                            <button
                                onClick={onNavigateToHistory}
                                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-cyan-400 transition-colors duration-300"
                                aria-label="Ver histórico"
                            >
                                Histórico
                            </button>
                        )}

                        {/* Theme toggle is always present */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                        </button>
                        
                        {/* Show logout or login button */}
                        {isLoggedIn ? (
                            <button
                                onClick={onLogout}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
                                aria-label="Logout"
                            >
                                <LogOut className="h-6 w-6" />
                            </button>
                        ) : (
                             <button
                                onClick={onNavigateToLogin}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-emerald-900 dark:text-cyan-100 bg-emerald-100/60 dark:bg-cyan-900/40 hover:bg-emerald-100 dark:hover:bg-cyan-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 transition-all"
                                aria-label="Login"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};