'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Plus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function DailyPlanner() {
    const [tasks] = useState([
        { id: 1, title: 'Gym Session', start: '06:00', end: '08:00', type: 'habit', color: 'bg-emerald-500' },
        { id: 2, title: 'College Classes', start: '09:00', end: '12:00', type: 'college', color: 'bg-blue-500' },
        { id: 3, title: 'Lunch & Break', start: '12:00', end: '13:00', type: 'break', color: 'bg-orange-400' },
        { id: 4, title: 'DSA Practice', start: '16:00', end: '18:00', type: 'study', color: 'bg-purple-500' },
        { id: 5, title: 'Web Dev Project', start: '19:00', end: '21:00', type: 'study', color: 'bg-pink-500' },
    ]);

    const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 5 AM to 10 PM

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
                    <p className="text-slate-500 mt-1">Organize your day hour-by-hour.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
            >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <CalendarDays className="w-5 h-5 text-slate-500" />
                        </button>
                        <h2 className="text-lg font-semibold">Today, Oct 24</h2>
                    </div>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 z-0"></div>

                    <div className="py-4">
                        {hours.map((hour) => {
                            const currentTask = tasks.find((t) => parseInt(t.start.split(':')[0]) === hour);
                            const isPM = hour >= 12;
                            const displayHour = hour > 12 ? hour - 12 : hour;
                            const ampm = isPM ? 'PM' : 'AM';

                            return (
                                <div key={hour} className="relative flex items-start gap-4 px-4 py-3 group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <div className="w-12 text-right shrink-0">
                                        <span className="text-sm font-medium text-slate-500 block">
                                            {hour === 12 ? '12' : displayHour.toString().padStart(2, '0')}:00
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">{ampm}</span>
                                    </div>

                                    <div className="flex-1 relative z-10 min-h-[40px]">
                                        {currentTask ? (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`absolute inset-0 right-4 rounded-xl shadow-md p-3 flex flex-col justify-center text-white cursor-pointer hover:brightness-110 transition-all ${currentTask.color}`}
                                            >
                                                <h4 className="font-semibold">{currentTask.title}</h4>
                                                <p className="text-xs opacity-90 font-medium">
                                                    {currentTask.start} - {currentTask.end}
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <div className="absolute inset-0 right-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-blue-500 hover:border-blue-500/50">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
