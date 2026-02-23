'use client';

import { motion } from 'framer-motion';
import { User, Lock, Bell, Moon, Sun, Download, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('Profile');
    const [isDark, setIsDark] = useState(true);
    const [notifications, setNotifications] = useState(true);

    const tabs = ['Profile', 'Account', 'Preferences', 'Data'];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account, preferences, and data.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 pt-4">
                {/* Sidebar */}
                <div className="w-full lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors",
                                activeTab === tab
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            {tab}
                            <ChevronRight className={clsx("w-4 h-4", activeTab === tab ? "opacity-100" : "opacity-0")} />
                        </button>
                    ))}
                    <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>
                    <Link
                        href="/login"
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors"
                    >
                        Log Out
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-8"
                    >
                        {activeTab === 'Profile' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        S
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Student</h3>
                                        <p className="text-slate-500">student@university.edu</p>
                                        <button className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                                            Change Avatar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input type="text" defaultValue="Student" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">University / College</label>
                                        <input type="text" defaultValue="MIT" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <button className="w-fit flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Appearance</h3>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-3">
                                            {isDark ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                                            <span className="font-medium">Dark Mode</span>
                                        </div>
                                        <div
                                            className={clsx(
                                                "relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300",
                                                isDark ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
                                            )}
                                            onClick={() => setIsDark(!isDark)}
                                        >
                                            <div className={clsx(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                                                isDark ? "left-7" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4">Notifications</h3>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-purple-500" />
                                            <span className="font-medium">Enable Push Notifications</span>
                                        </div>
                                        <div
                                            className={clsx(
                                                "relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300",
                                                notifications ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
                                            )}
                                            onClick={() => setNotifications(!notifications)}
                                        >
                                            <div className={clsx(
                                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                                                notifications ? "left-7" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Account' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Security Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <button className="w-fit flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Data' && (
                            <div className="space-y-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mt-4 mb-4 shadow-lg shadow-blue-500/20">
                                    <Download className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold">Export Your Data</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    Download a complete archive of your tasks, habits, study sessions, and analytics in CSV format.
                                </p>
                                <button className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95 mx-auto">
                                    Request Data Archive
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
