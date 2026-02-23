'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // If the path contains 'dashboard', don't render this main public navbar
    // Instead, the dashboard layout handles the sidebar/topbar.
    if (pathname.startsWith('/dashboard')) return null;

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                                Study<span className="text-blue-500">Sync</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Features</Link>
                        <Link href="/#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Testimonials</Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95">
                                <User className="w-4 h-4" />
                                Sign Up
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden glass-card m-2 mt-0 p-4 border-t border-slate-200 dark:border-slate-800"
                >
                    <div className="flex flex-col space-y-4">
                        <Link href="/#features" className="text-slate-600 dark:text-slate-300 font-medium rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Features</Link>
                        <Link href="/#testimonials" className="text-slate-600 dark:text-slate-300 font-medium rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Testimonials</Link>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />
                        <Link href="/login" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <LogIn className="w-4 h-4" /> Login
                        </Link>
                        <Link href="/signup" className="flex items-center gap-2 text-white bg-blue-600 font-medium justify-center rounded-lg px-3 py-2 hover:bg-blue-700 transition">
                            <User className="w-4 h-4" /> Sign Up
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
