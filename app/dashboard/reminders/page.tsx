'use client';

import { motion } from 'framer-motion';
import { Bell, Clock, Trash2, Edit3, Plus, Mail, Smartphone, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function RemindersPage() {
    const [reminders, setReminders] = useState([
        { id: 1, title: 'Gym Time', time: '06:00 AM', type: 'Daily', channels: ['Push'], active: true },
        { id: 2, title: 'DSA Practice Session', time: '04:00 PM', type: 'Custom', channels: ['Push', 'Email'], active: true },
        { id: 3, title: 'Sleep Reminder', time: '11:00 PM', type: 'Daily', channels: ['Push'], active: true },
        { id: 4, title: 'Weekly Review', time: 'Sunday 10:00 AM', type: 'Weekly', channels: ['Email'], active: false },
    ]);

    const toggleReminder = (id: number) => {
        setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
                    <p className="text-slate-500 mt-1">Never miss a deadline or a study session.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                    <Plus className="w-4 h-4" /> Add Reminder
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                <div className="lg:col-span-2 space-y-4">
                    {reminders.map((reminder, i) => (
                        <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={clsx(
                                "glass-card border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all group",
                                reminder.active ? "border-slate-200/50 dark:border-slate-800/50" : "border-slate-100 dark:border-slate-800/20 opacity-60"
                            )}
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                    reminder.active ? "bg-blue-500/10 text-blue-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}>
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">{reminder.title}</h3>
                                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                            <Clock className="w-4 h-4" /> {reminder.time}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                            <CalendarDays className="w-4 h-4" /> {reminder.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        {reminder.channels.map(channel => (
                                            <span key={channel} className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {channel === 'Push' ? <Smartphone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                                {channel}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:flex-col justify-end border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                                <div
                                    className={clsx(
                                        "relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-300",
                                        reminder.active ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
                                    )}
                                    onClick={() => toggleReminder(reminder.id)}
                                >
                                    <div className={clsx(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                                        reminder.active ? "left-6" : "left-1"
                                    )} />
                                </div>
                                <div className="flex items-center gap-2 ml-auto sm:ml-0 sm:mt-2">
                                    <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col items-center justify-center text-center min-h-[300px] border-dashed hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform mb-4 shadow-lg shadow-blue-500/20">
                            <Bell className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">Smart Alerts</h3>
                        <p className="text-slate-500 text-sm">
                            Connect your calendar to get automatic study reminders before your deadlines.
                        </p>
                        <button className="mt-6 px-4 py-2 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                            Connect Calendar
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
