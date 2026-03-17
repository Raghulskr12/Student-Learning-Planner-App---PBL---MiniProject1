'use client';

import { Bell, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
    LayoutDashboard,
    CalendarDays,
    Calendar,
    Timer,
    BookOpen,
    BarChartBig,
    Settings,
    LogOut
} from "lucide-react";

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Agenda', href: '/dashboard/daily-planner', icon: CalendarDays },
    { name: 'Weekly Overview', href: '/dashboard/weekly-planner', icon: Calendar },
    { name: 'Deep Work', href: '/dashboard/study-timer', icon: Timer },
    { name: 'Journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartBig },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <header className="h-16 flex items-center justify-between px-4 lg:px-10 border-b border-slate-200/50 dark:border-slate-800/50 glass-nav z-40 sticky top-0">
                <div className="flex items-center gap-4 flex-1">
                    <button 
                        className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="relative w-full max-w-md hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks, templates..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-3 lg:gap-4">
                    <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50 dark:border-slate-900"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md cursor-pointer text-sm font-bold">
                        JD
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    <div className="absolute top-0 left-0 w-[280px] h-full bg-white dark:bg-slate-950 shadow-2xl flex flex-col transform transition-transform border-r border-slate-200 dark:border-slate-800">
                        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                            <span className="font-extrabold text-xl tracking-tight">The <span className="text-blue-600 dark:text-blue-500">1%</span> Club</span>
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                            <Link
                                href="/login"
                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
                            >
                                <LogOut className="w-5 h-5 shrink-0" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
