'use client';

import { motion } from 'framer-motion';
import { Play, CheckCircle2, Flame, Target, ChevronRight, Activity, CalendarDays, Timer, Clock } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function Dashboard() {
    const todayProgress = 65; // Example 65%

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
                    <p className="text-slate-500 mt-1">Ready to dominate the day. Here is your overview.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Action Focus */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-card border flex items-center p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 shadow-lg shadow-blue-500/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <Timer className="w-48 h-48 text-blue-500 blur-sm mix-blend-overlay" />
                    </div>
                    
                    <div className="relative z-10 w-full flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between">
                        <div>
                            <span className="text-blue-500 font-bold tracking-wider text-sm uppercase flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Active Now
                            </span>
                            <h2 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">Study Session 1</h2>
                            <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 09:00 AM - 12:30 PM
                            </p>
                        </div>

                        <Link 
                            href="/dashboard/study-timer" 
                            className="shrink-0 flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 font-bold text-lg group"
                        >
                            <Play className="w-6 h-6 fill-white drop-shadow-md group-hover:scale-110 transition-transform" /> 
                            Enter Deep Work
                        </Link>
                    </div>
                </motion.div>

                {/* Today's Progress Ring */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col items-center justify-center text-center"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-500" /> Daily Routine
                    </h3>
                    
                    <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                            <circle
                                cx="80" cy="80" r="72"
                                stroke="currentColor" strokeWidth="12" fill="transparent"
                                className="text-slate-100 dark:text-slate-800"
                            />
                            <circle
                                cx="80" cy="80" r="72"
                                stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={72 * 2 * Math.PI}
                                strokeDashoffset={72 * 2 * Math.PI - (todayProgress / 100) * 72 * 2 * Math.PI}
                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="z-10 flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{todayProgress}%</span>
                            <span className="text-xs font-semibold text-slate-500 uppercase">Completed</span>
                        </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm font-medium">13 of 20 items checked</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Routine */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-purple-500" /> Up Next
                        </h2>
                        <Link href="/dashboard/daily-planner" className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1">
                            Full Agenda <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="p-4 space-y-3">
                        {[
                            { time: '1:30 PM', title: 'Study Session 2', type: 'Deep Work', color: 'border-blue-500' },
                            { time: '4:30 PM', title: '2 Eggs', type: 'Diet', color: 'border-orange-500' },
                            { time: '5:30 PM', title: 'Study Session 3', type: 'Deep Work', color: 'border-purple-500' },
                        ].map((item, i) => (
                            <div key={i} className={clsx("flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-l-4", item.color)}>
                                <div className="text-slate-500 font-semibold text-sm w-20 shrink-0">{item.time}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                                </div>
                                <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
                                    {item.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Deep Work Today</h3>
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">2.5</span>
                            <span className="text-slate-500 font-medium mb-1">hours</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[40%] rounded-full" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Goal: 6 hours</p>
                    </div>

                    <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Consistency Streak</h3>
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-orange-500">12</span>
                            <span className="text-slate-500 font-medium mb-1">days</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> System running flawlessly
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
