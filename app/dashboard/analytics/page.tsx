'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Zap, Layers, Flame, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { getAnalyticsData } from '@/app/actions/analytics';

export default function Analytics() {
    const [heatmapData, setHeatmapData] = useState<{ date: string; level: number }[]>([]);
    const [stats, setStats] = useState({
        totalDeepWork: "0h",
        habitScore: "0%",
        tasksCompleted: "0",
        streak: "0 Days"
    });
    const [weeklyData, setWeeklyData] = useState<{ day: string; minutes: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const res = await getAnalyticsData();
            if (res.success && res.data) {
                // Build 70-day heatmap – one cell per day (newest-first from DB, so reverse)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const heatmap: { date: string; level: number }[] = [];
                
                for (let i = 69; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const found = res.data.find((entry: any) => {
                        const eDate = new Date(entry.date);
                        eDate.setHours(0, 0, 0, 0);
                        return eDate.toISOString().split('T')[0] === dateStr;
                    });
                    heatmap.push({ date: dateStr, level: found?.habitScore || 0 });
                }
                setHeatmapData(heatmap);

                setStats({
                    totalDeepWork: res.stats?.totalDeepWork || "0h",
                    habitScore: res.stats?.habitScore || "0%",
                    tasksCompleted: res.stats?.tasksCompleted || "0",
                    streak: res.stats?.streak || "0 Days",
                });

                if (res.weeklyData) setWeeklyData(res.weeklyData);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const getColor = (level: number) => {
        switch (level) {
            case 4: return 'bg-emerald-500';
            case 3: return 'bg-emerald-400';
            case 2: return 'bg-emerald-300';
            case 1: return 'bg-emerald-200 dark:bg-emerald-700';
            default: return 'bg-slate-100 dark:bg-slate-800';
        }
    };

    const maxWeeklyMinutes = Math.max(...weeklyData.map(d => d.minutes), 60);

    // Month labels for heatmap
    const getMonthLabel = (dateStr: string) => {
        const d = new Date(dateStr);
        if (d.getDate() <= 7) return d.toLocaleDateString('en-US', { month: 'short' });
        return '';
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 mt-1">Consistency is the only metric that matters.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center gap-4 mt-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-500 animate-pulse">Syncing your data...</p>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { label: "Deep Work Total", value: stats.totalDeepWork, sub: "Active Focus Hours", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                            { label: "Habit Score", value: stats.habitScore, sub: "Avg Consistency", icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
                            { label: "Current Streak", value: stats.streak, sub: "Keep it going!", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
                            { label: "Tasks Completed", value: stats.tasksCompleted, sub: "All Time", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50"
                            >
                                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
                                    <stat.icon className={clsx("w-5 h-5", stat.color)} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                                <p className="text-slate-700 dark:text-slate-200 font-bold mt-0.5">{stat.label}</p>
                                <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-500" /> {stat.sub}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Heatmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 glass-card p-6 border border-slate-200/50 dark:border-slate-800/50"
                        >
                            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-emerald-500" /> Consistency Heatmap
                            </h2>
                            <p className="text-sm text-slate-500 mb-5">Last 70 days of habit tracking</p>

                            <div className="w-full overflow-x-auto pb-2">
                                <div className="min-w-max">
                                    {/* Day labels */}
                                    <div className="flex gap-1 pl-8 mb-1">
                                        {heatmapData.filter((_, i) => i % 7 === 0).map((d) => {
                                            const label = getMonthLabel(d.date);
                                            return (
                                                <div key={d.date} className="w-4 text-[9px] text-slate-400 font-semibold" style={{ minWidth: '1rem' }}>
                                                    {label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-400 py-0.5 pr-1" style={{ height: `${7 * 20 - 4}px` }}>
                                            <span>Mon</span>
                                            <span>Wed</span>
                                            <span>Fri</span>
                                            <span>Sun</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {Array.from({ length: 10 }).map((_, colIdx) => (
                                                <div key={colIdx} className="flex flex-col gap-1.5">
                                                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                                                        const idx = colIdx * 7 + rowIdx;
                                                        const cell = heatmapData[idx];
                                                        return (
                                                            <div
                                                                key={rowIdx}
                                                                title={cell ? `${cell.date}: Level ${cell.level}` : ''}
                                                                className={clsx(
                                                                    "w-4 h-4 rounded-sm transition-all hover:ring-2 hover:ring-emerald-400 hover:ring-offset-1 hover:ring-offset-white dark:hover:ring-offset-slate-900 cursor-pointer",
                                                                    cell ? getColor(cell.level) : 'bg-slate-100 dark:bg-slate-800'
                                                                )}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-500">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    {['bg-slate-100 dark:bg-slate-800', 'bg-emerald-200 dark:bg-emerald-700', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500'].map((c, i) => (
                                        <div key={i} className={clsx("w-3 h-3 rounded-sm", c)} />
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </motion.div>

                        {/* Weekly Deep Work Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col"
                        >
                            <h2 className="text-xl font-bold mb-1">Weekly Deep Work</h2>
                            <p className="text-slate-500 text-sm mb-6 font-medium">Focus distribution (last 7 days)</p>

                            <div className="space-y-4 flex-1 flex flex-col justify-center">
                                {weeklyData.length > 0 ? weeklyData.map((d, i) => {
                                    const h = Math.floor(d.minutes / 60);
                                    const m = d.minutes % 60;
                                    const label = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : d.minutes > 0 ? `${m}m` : '0';
                                    const pct = maxWeeklyMinutes > 0 ? Math.round((d.minutes / maxWeeklyMinutes) * 100) : 0;
                                    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-violet-500', 'bg-rose-500', 'bg-pink-500', 'bg-fuchsia-500'];
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-8 text-xs font-bold text-slate-500">{d.day}</span>
                                            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={clsx("h-full rounded-full transition-all duration-700", pct > 0 ? colors[i % colors.length] : 'bg-slate-100 dark:bg-slate-800')}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="w-10 text-right text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center text-slate-400 text-sm font-medium py-8">
                                        Complete focus sessions to see your weekly data.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
}
