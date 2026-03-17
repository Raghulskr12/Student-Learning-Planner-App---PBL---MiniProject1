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
        <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20"> {/* increased height slightly */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white transition-opacity group-hover:opacity-80">
                                The <span className="text-blue-600 dark:text-blue-500">1%</span> Club
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/#features" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all font-bold text-sm">Features</Link>
                        <Link href="/#testimonials" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all font-bold text-sm">Testimonials</Link>
                        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800 ml-4">
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm transition-all">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm transition-all shadow-lg active:scale-95">
                                <User className="w-4 h-4" />
                                Start Free
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
