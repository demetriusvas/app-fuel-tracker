import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';

const App: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
    const [showLogin, setShowLogin] = React.useState(false);

    const toggleTheme = React.useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, [theme, setTheme]);
    
    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const handleNavigateToLogin = () => setShowLogin(true);
    const handleBackToLanding = () => setShowLogin(false);
    
    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowLogin(false);
    };

    const renderContent = () => {
        if (isLoggedIn) {
            return <Dashboard />;
        }
        if (showLogin) {
            return <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />;
        }
        return <LandingPage onNavigateToLogin={handleNavigateToLogin} />;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            <Header 
                theme={theme} 
                toggleTheme={toggleTheme} 
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onNavigateToLogin={handleNavigateToLogin}
            />
            <main className="flex-grow w-full">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;