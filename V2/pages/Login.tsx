import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ScaleIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the login link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="mx-auto h-12 w-auto flex justify-center items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-200 flex items-center justify-center shadow-lg shadow-zinc-900/10 transition-transform group-hover:scale-105">
                        <ScaleIcon className="w-6 h-6 text-white dark:text-zinc-900" />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">
                        NyayaFlow
                    </span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {isSignUp ? 'Create your account' : 'Sign in to your account'}
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Or{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                        {isSignUp ? 'sign in to existing account' : 'start your 14-day free trial'}
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-zinc-950 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-200 dark:border-zinc-800">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-white dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-white dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-zinc-900 dark:bg-white px-3 py-2 text-sm font-semibold text-white dark:text-zinc-900 shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 20.4144C16.6366 20.4144 20.5283 17.2721 21.9427 13.0649H12.0003V10.9351H24.0628C24.1873 11.667 24.2503 12.4334 24.2503 13.2386C24.2503 20.0153 18.7656 25.5 12.0003 25.5C5.23497 25.5 -0.25 20.015 -0.25 13.25C-0.25 6.48497 5.23497 1 12.0003 1C15.0505 1 17.8174 2.108 19.9678 3.96825L17.5878 6.34825C16.0355 5.222 14.1132 4.562 12.0003 4.562C7.20083 4.562 3.3125 8.45033 3.3125 13.25C3.3125 18.0497 7.20083 21.938 12.0003 21.938Z"
                                        fill="currentColor"
                                        style={{ fill: "currentColor" }}
                                    />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="h-5 w-5 mr-2 text-zinc-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.685-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
