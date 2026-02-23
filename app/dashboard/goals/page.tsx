'use client';

import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2, Circle, MoreVertical, Trophy, Flame } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function GoalsPage() {
    const [goals, setGoals] = useState([
        { id: 1, title: 'Finish 2 DSA problems', category: 'Daily', completed: true },
        { id: 2, title: 'Complete React Course Module', category: 'Weekly', completed: false },
        { id: 3, title: 'Read 20 pages of Atomic Habits', category: 'Daily', completed: false },
        { id: 4, title: 'Secure a 10 LPA+ Job Offer', category: 'Long-term', completed: false },
        { id: 5, title: 'Maintain 85% Attendance', category: 'Semester', completed: false },
    ]);

    const toggleGoal = (id: number) => {
        setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const categories = ['Daily', 'Weekly', 'Semester', 'Long-term'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Goals & Targets</h1>
                    <p className="text-slate-500 mt-1">Set, track, and crush your academic and personal goals.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                    <Plus className="w-4 h-4" /> New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                {/* Goals List */}
                <div className="lg:col-span-2 space-y-6">
                    {categories.map((category) => {
                        const categoryGoals = goals.filter(g => g.category === category);
                        if (categoryGoals.length === 0) return null;

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                                    <Target className={clsx(
                                        "w-5 h-5",
                                        category === 'Daily' ? 'text-blue-500' :
                                            category === 'Weekly' ? 'text-purple-500' :
                                                category === 'Semester' ? 'text-pink-500' : 'text-emerald-500'
                                    )} />
                                    <h2 className="text-lg font-semibold">{category} Goals</h2>
                                    <span className="ml-auto bg-slate-200 dark:bg-slate-800 text-xs font-semibold px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                                        {categoryGoals.filter(g => g.completed).length}/{categoryGoals.length}
                                    </span>
                                </div>
                                <div className="p-2">
                                    {categoryGoals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
                                            onClick={() => toggleGoal(goal.id)}
                                        >
                                            <button className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {goal.completed ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                ) : (
                                                    <Circle className="w-6 h-6" />
                                                )}
                                            </button>
                                            <span className={clsx(
                                                "flex-1 font-medium transition-all",
                                                goal.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200"
                                            )}>
                                                {goal.title}
                                            </span>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Motivational Sidebar */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/30">
                            <Flame className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">15 Day Streak!</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                            You've completed at least one goal every day for 15 days straight. Keep the momentum going!
                        </p>
                        <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full w-3/4 rounded-full" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Milestones</h3>
                        <ul className="space-y-4">
                            {[
                                { label: 'Completed 50 Pomodoro Sessions', done: true },
                                { label: 'Read 5 Books this year', done: false },
                                { label: '100 hours of Coding', done: false }
                            ].map((milestone, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5">
                                        {milestone.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700" />}
                                    </div>
                                    <span className={milestone.done ? "text-slate-500" : "text-slate-700 dark:text-slate-300 font-medium"}>
                                        {milestone.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
