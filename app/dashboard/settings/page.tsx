'use client';

import { motion } from 'framer-motion';
import { User, Bell, Shield, Key, Wand2, Smartphone, MonitorSmartphone, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', icon: User, label: 'Account Profile' },
        { id: 'preferences', icon: Wand2, label: 'App Preferences' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'security', icon: Shield, label: 'Security' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your elite productivity workspace.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                                activeTab === tab.id 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8"
                    >
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                        JD
                                    </div>
                                    <div className="space-y-2">
                                        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                            Change Avatar
                                        </button>
                                        <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                                        <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                                        <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                        <div className="flex items-center relative">
                                            <Mail className="w-5 h-5 absolute left-4 text-slate-400" />
                                            <input type="email" defaultValue="john.doe@top1percent.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold mb-6">App Preferences</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                        <div className="space-y-1">
                                            <h4 className="font-bold flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-blue-500" /> Theme Preference</h4>
                                            <p className="text-sm text-slate-500">Choose how the app looks to you.</p>
                                        </div>
                                        <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium appearance-none">
                                            <option>System Default</option>
                                            <option>Light Mode</option>
                                            <option>Dark Mode</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                        <div className="space-y-1">
                                            <h4 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-advance Routine</h4>
                                            <p className="text-sm text-slate-500">Automatically move to the next block when current is 100%.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                                <p className="text-slate-500 mb-4">We believe in deep work. We only notify you when it truly matters.</p>
                                
                                <div className="space-y-4">
                                    {[
                                        { title: "Daily Routine Reminder", desc: "Push notification at the start of Morning Block." },
                                        { title: "Weekly Review Setup", desc: "Email reminder on Sunday evening to plan the week." },
                                        { title: "Deep Work Completion", desc: "Sound chime when a Pomodoro session ends.", checked: true },
                                    ].map((notif, i) => (
                                        <div key={i} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                            <div className="space-y-1 pr-4">
                                                <h4 className="font-bold">{notif.title}</h4>
                                                <p className="text-sm text-slate-500">{notif.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={notif.checked} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold mb-6">Security & Login</h2>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button className="px-6 py-3 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all active:scale-95 shadow-lg">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
