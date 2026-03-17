'use client';

import { motion } from 'framer-motion';
import { Target, Activity, Zap, Layers, Flame, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Analytics() {
    // Generate mock heatmap data (10 weeks x 7 days)
    const heatmapData = Array.from({ length: 70 }, (_, i) => {
        const value = Math.random();
        if (value > 0.8) return 4; // Max activity
        if (value > 0.5) return 3;
        if (value > 0.2) return 2;
        if (value > 0.1) return 1;
        return 0; // Empty
    });

    const getColor = (level: number) => {
        switch (level) {
            case 4: return 'bg-emerald-500';
            case 3: return 'bg-emerald-400 opacity-80';
            case 2: return 'bg-emerald-300 opacity-60';
            case 1: return 'bg-emerald-200 opacity-40';
            default: return 'bg-slate-100 dark:bg-slate-800';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 mt-1">Consistency is the only metric that matters.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Deep Work Total", value: "142h", sub: "+12h this month", icon: Activity, color: "text-blue-500" },
                    { label: "Habit Score", value: "94%", sub: "Top 5% of users", icon: Target, color: "text-purple-500" },
                    { label: "Current Streak", value: "12 Days", sub: "Personal best: 45", icon: Flame, color: "text-orange-500" },
                    { label: "Tasks Completed", value: "847", sub: "32 this week", icon: CheckCircle2, color: "text-emerald-500" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Last 30 Days</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-800 dark:text-slate-200 font-bold mb-1">{stat.label}</p>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" /> {stat.sub}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-card p-8 border border-slate-200/50 dark:border-slate-800/50"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-emerald-500" /> Consistency Heatmap
                    </h2>
                    
                    <div className="w-full overflow-x-auto custom-scrollbar pb-4">
                        <div className="min-w-max flex gap-2">
                            {/* Days labels */}
                            <div className="flex flex-col justify-between text-xs font-semibold text-slate-400 pt-1 pb-1 pr-2">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                                <span>Sun</span>
                            </div>
                            
                            {/* Heatmap columns */}
                            <div className="flex gap-2">
                                {Array.from({ length: 10 }).map((_, colIndex) => (
                                    <div key={colIndex} className="flex flex-col gap-2">
                                        {Array.from({ length: 7 }).map((_, rowIndex) => {
                                            const index = colIndex * 7 + rowIndex;
                                            const level = heatmapData[index];
                                            return (
                                                <div 
                                                    key={rowIndex} 
                                                    title={`Activity level: ${level}`}
                                                    className={clsx(
                                                        "w-4 h-4 rounded-sm transition-all hover:ring-2 hover:ring-emerald-500 hover:ring-offset-1 hover:ring-offset-slate-950 cursor-pointer",
                                                        getColor(level)
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-slate-500">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-200 opacity-40"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-300 opacity-60"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-400 opacity-80"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                        </div>
                        <span>More</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-8 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center"
                >
                    <h2 className="text-xl font-bold mb-2">Weekly Deep Work</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Your focus distribution by day</p>

                    <div className="space-y-5">
                        {[
                            { day: 'Mon', h: 4, pct: 80, color: 'bg-blue-500' },
                            { day: 'Tue', h: 3, pct: 60, color: 'bg-indigo-500' },
                            { day: 'Wed', h: 5, pct: 100, color: 'bg-purple-500' },
                            { day: 'Thu', h: 2, pct: 40, color: 'bg-pink-500' },
                            { day: 'Fri', h: 3.5, pct: 70, color: 'bg-rose-500' },
                        ].map((d, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-8 text-sm font-bold text-slate-500">{d.day}</span>
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={clsx("h-full rounded-full transition-all", d.color)} style={{ width: `${d.pct}%` }} />
                                </div>
                                <span className="w-8 text-right text-sm font-bold text-slate-700 dark:text-slate-300">{d.h}h</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
