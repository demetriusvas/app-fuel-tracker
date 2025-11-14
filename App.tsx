import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
    const [user, setUser] = React.useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = React.useState(true);
    const [showLogin, setShowLogin] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

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
    
    const handleLogout = async () => {
        await signOut(auth);
        setShowLogin(false); // Go back to landing page after logout
    };

    if (loadingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <Loader2 className="animate-spin h-12 w-12 text-emerald-500" />
            </div>
        );
    }

    const renderContent = () => {
        if (user) {
            return <Dashboard />;
        }
        if (showLogin) {
            return <LoginPage onBack={handleBackToLanding} />;
        }
        return <LandingPage onNavigateToLogin={handleNavigateToLogin} />;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            <Header 
                theme={theme} 
                toggleTheme={toggleTheme} 
                isLoggedIn={!!user}
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