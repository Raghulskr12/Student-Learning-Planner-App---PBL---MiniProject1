'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
    LayoutDashboard,
    CalendarDays,
    CalendarCheck,
    Calendar,
    Timer,
    BarChartBig,
    BookOpen,
    Target,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Planner', href: '/dashboard/daily-planner', icon: CalendarDays },
    { name: 'Weekly Planner', href: '/dashboard/weekly-planner', icon: CalendarCheck },
    { name: 'Monthly Planner', href: '/dashboard/monthly-planner', icon: Calendar },
    { name: 'Study Timer', href: '/dashboard/study-timer', icon: Timer },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartBig },
    { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
    { name: 'Goals', href: '/dashboard/goals', icon: Target },
    { name: 'Reminders', href: '/dashboard/reminders', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={clsx(
                "glass-card h-[calc(100vh-2rem)] sticky top-4 m-4 hidden lg:flex flex-col transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/50">
                {!collapsed && (
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">StudySync</span>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={clsx(
                        "p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors",
                        collapsed && "absolute -right-3 top-5 bg-white shadow-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-full"
                    )}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5 custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                                isActive
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon className={clsx("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-blue-500 transition-colors")} />

                            {!collapsed && (
                                <span className="font-medium whitespace-nowrap pr-4">
                                    {item.name}
                                </span>
                            )}

                            {isActive && !collapsed && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <Link
                    href="/login"
                    className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group",
                        collapsed && "justify-center"
                    )}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
                </Link>
            </div>
        </div>
    );
}
