'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { CalendarRange, Activity, Target } from 'lucide-react';

const studyData = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 2 },
    { name: 'Fri', hours: 6 },
    { name: 'Sat', hours: 8 },
    { name: 'Sun', hours: 3 },
];

const subjectData = [
    { subject: 'DSA', progress: 85 },
    { subject: 'OS', progress: 60 },
    { subject: 'DBMS', progress: 75 },
    { subject: 'Network', progress: 40 },
];

export default function Analytics() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-1">Track your progress and consistency over time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CalendarRange className="w-5 h-5 text-blue-500" /> Weekly Study Hours
                        </h2>
                        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium outline-none text-slate-700 dark:text-slate-300">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>

                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={studyData}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Small Widgets */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6"
                    >
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-purple-500" /> Subject Progress
                        </h2>
                        <div className="space-y-4">
                            {subjectData.map((subj, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1 font-medium">
                                        <span>{subj.subject}</span>
                                        <span className="text-slate-500">{subj.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subj.progress}%` }}
                                            transition={{ duration: 1, delay: 0.4 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6"
                    >
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-emerald-500" /> Consistency Score
                        </h2>
                        <div className="flex items-center justify-center py-6">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 absolute">
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={60 * 2 * Math.PI} strokeDashoffset={60 * 2 * Math.PI * 0.15} className="text-emerald-500 transition-all duration-1000 ease-in-out" />
                                </svg>
                                <div className="text-center font-bold">
                                    <span className="text-3xl">85</span>
                                    <span className="text-slate-500">%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-2">You are in the top 15% of consistent learners this week.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
