'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'student' && password === 'student@123') {
            router.push('/dashboard');
        } else {
            alert('Invalid credentials. Use student / student@123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card max-w-md w-full p-8 md:p-10 relative z-10"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl -z-10 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl -z-10 animate-blob animation-delay-2000"></div>

                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
                        <span className="font-bold text-4xl tracking-tight text-slate-900 dark:text-white">
                            The <span className="text-red-500">1%</span> Club
                        </span>
                    </Link>
                    <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Sign in to access your daily planner
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                            Username or Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email"
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="student"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="student@123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <Link href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 group"
                    >
                        Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 glass-card text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-900 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3" />
                        Google
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                        Sign up now
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
