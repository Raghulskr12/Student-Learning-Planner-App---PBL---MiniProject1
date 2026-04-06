'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
    LayoutDashboard,
    CalendarDays,
    Calendar,
    Timer,
    BarChartBig,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Agenda', href: '/dashboard/daily-planner', icon: CalendarDays },
    { name: 'Weekly Overview', href: '/dashboard/weekly-planner', icon: Calendar },
    { name: 'Deep Work', href: '/dashboard/study-timer', icon: Timer },
    { name: 'Journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChartBig },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { data: session } = useSession();

    const userName = session?.user?.name || 'User';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const handleSignOut = () => signOut({ callbackUrl: '/login' });

    return (
        <div
            className={clsx(
                "glass-card h-[calc(100vh-2rem)] sticky top-4 m-4 hidden lg:flex flex-col transition-all duration-300 relative",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/50">
                {!collapsed && (
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className="font-extrabold text-xl tracking-tight">
                            The <span className="text-blue-600 dark:text-blue-500">1%</span> Club
                        </span>
                    </div>
                )}
                {collapsed && (
                    <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10">
                        <span className="font-extrabold text-blue-600 dark:text-blue-500 text-sm">1%</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={clsx(
                        "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors",
                        collapsed && "absolute -right-3.5 top-5 bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 rounded-full"
                    )}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-1 custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                                collapsed && "justify-center",
                                isActive
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon className={clsx(
                                "w-5 h-5 shrink-0 transition-colors",
                                isActive ? "text-white" : "group-hover:text-blue-500"
                            )} />

                            {!collapsed && (
                                <span className="font-medium whitespace-nowrap text-sm">{item.name}</span>
                            )}

                            {isActive && !collapsed && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute right-2.5 w-1.5 h-1.5 bg-white rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User + Logout */}
            <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-1">
                {!collapsed && (
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{userName}</p>
                            <p className="text-xs text-slate-400 font-medium">Elite Member</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleSignOut}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group",
                        collapsed && "justify-center"
                    )}
                    title={collapsed ? "Sign Out" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium text-sm whitespace-nowrap">Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
