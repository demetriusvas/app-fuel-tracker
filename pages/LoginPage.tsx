import React, { useState } from 'react';
import { GoogleIcon } from '../components/GoogleIcon';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    FirebaseError
} from 'firebase/auth';

interface LoginPageProps {
    onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getFirebaseErrorMessage = (error: unknown) => {
        // Fix: Property 'code' does not exist on type 'unknown'. Replaced `instanceof`
        // with a structural type guard to safely access the error code.
        if (error && typeof error === 'object' && 'code' in error) {
            switch ((error as { code: string }).code) {
                case 'auth/invalid-email':
                    return 'Formato de e-mail inválido.';
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    return 'E-mail ou senha incorretos.';
                case 'auth/email-already-in-use':
                    return 'Este e-mail já está em uso.';
                case 'auth/weak-password':
                    return 'A senha deve ter pelo menos 6 caracteres.';
                case 'auth/popup-closed-by-user':
                    return 'A janela de login foi fechada. Tente novamente.';
                default:
                    return 'Ocorreu um erro. Tente novamente.';
            }
        }
        return 'Ocorreu um erro desconhecido.';
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // onAuthStateChanged in App.tsx will handle navigation
        } catch (err) {
            setError(getFirebaseErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(getFirebaseErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

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
                        {isLoginView ? 'Acesse sua conta' : 'Crie sua conta'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        e comece a economizar agora mesmo.
                    </p>
                </div>
                <div className="p-8 space-y-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
                    {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
                    <form className="space-y-6" onSubmit={handleEmailSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Endereço de e-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="voce@exemplo.com"
                                className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3"/> : null}
                                {isLoginView ? 'Entrar' : 'Criar Conta'}
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
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-70"
                        >
                            <GoogleIcon className="h-5 w-5" />
                            <span>Entrar com Google</span>
                        </button>
                    </div>
                    
                     <p className="text-center text-sm">
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};