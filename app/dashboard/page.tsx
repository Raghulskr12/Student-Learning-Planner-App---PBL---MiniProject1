'use client';

import { motion } from 'framer-motion';
import { Clock, CheckSquare, Target, Flame, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const stats = [
        { label: "Study Hours Today", value: "4.5h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Tasks Done", value: "8/12", icon: CheckSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Productivity Score", value: "92%", icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Habit Streak", value: "15 Days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, Student! 👋</h1>
                    <p className="text-slate-500 mt-1">Here is your academic overview for today.</p>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-shadow"
                    >
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Tasks */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-blue-500" /> Today's Tasks
                        </h2>
                        <Link href="/dashboard/daily-planner" className="flex items-center text-sm text-blue-500 hover:text-blue-600 font-medium">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6 flex-1 space-y-3">
                        {[
                            { time: '09:00 AM', task: 'Attend Data Structures Lecture', category: 'College', checked: true },
                            { time: '11:00 AM', task: 'Complete Linear Algebra Assignment', category: 'Study', checked: false },
                            { time: '04:00 PM', task: 'Solve 2 LeetCode Problems', category: 'Prep', checked: false },
                            { time: '06:00 PM', task: 'Gym Workout', category: 'Habit', checked: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 transition-colors group">
                                <button className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${item.checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                                    {item.checked && <CheckSquare className="w-4 h-4" />}
                                </button>
                                <div className="flex-1">
                                    <p className={`font-medium ${item.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {item.task}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {item.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="space-y-6">
                    {/* Upcoming Deadlines */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 flex flex-col"
                    >
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800/50">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" /> Upcoming Deadlines
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {[
                                { title: "OS Project Phase 1", due: "Tomorrow, 11:59 PM", subject: "Operating Systems" },
                                { title: "Calculus Quiz", due: "Friday, 10:00 AM", subject: "Maths" },
                            ].map((dl, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{dl.title}</h4>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 flex items-center gap-1"><BookOpen className="w-3 h-3" /> {dl.subject}</span>
                                        <span className="text-red-500 font-medium">{dl.due}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Habit Tracker Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 flex flex-col"
                    >
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800/50">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" /> Habits
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {[
                                { name: "Drink Water", progress: 80, color: "bg-blue-500" },
                                { name: "Reading", progress: 30, color: "bg-purple-500" },
                                { name: "Meditation", progress: 100, color: "bg-emerald-500" }
                            ].map((habit, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{habit.name}</span>
                                        <span className="text-slate-500">{habit.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${habit.color} rounded-full`} style={{ width: `${habit.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
