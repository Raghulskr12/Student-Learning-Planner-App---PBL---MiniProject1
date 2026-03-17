'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, Send, Moon, Trophy, Target, Activity, Coffee } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function DailyJournal() {
    const [ratings, setRatings] = useState({ workout: 0, studies: 0, diet: 0, sleep: 0 });
    const [wins, setWins] = useState('');
    const [lessons, setLessons] = useState('');

    const categories = [
        { id: 'workout', label: 'Workout & Gym', icon: Activity, color: 'text-blue-500', bg: 'hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20' },
        { id: 'studies', label: 'Deep Work', icon: Target, color: 'text-purple-500', bg: 'hover:border-purple-500 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20' },
        { id: 'diet', label: 'Diet & Nutrition', icon: Coffee, color: 'text-orange-500', bg: 'hover:border-orange-500 peer-checked:border-orange-500 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20' },
        { id: 'sleep', label: 'Sleep & Recovery', icon: Moon, color: 'text-emerald-500', bg: 'hover:border-emerald-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20' }
    ];

    const handleRating = (category: keyof typeof ratings, score: number) => {
        setRatings(prev => ({ ...prev, [category]: score }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Reflection</h1>
                    <p className="text-slate-500 mt-1">Review your day, log your wins, and reset for tomorrow.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold">Evening Routine</span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-8 space-y-10"
            >
                {/* Ratings */}
                <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> End of Day Ratings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map(cat => (
                            <div key={cat.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <cat.icon className={clsx("w-5 h-5", cat.color)} /> {cat.label}
                                    </span>
                                    <span className="font-black text-xl text-slate-900 dark:text-white">{ratings[cat.id as keyof typeof ratings]}/10</span>
                                </div>
                                <div className="flex justify-between gap-1">
                                    {[1,2,3,4,5,6,7,8,9,10].map(score => (
                                        <div key={score} className="flex-1 relative h-10 group cursor-pointer" onClick={() => handleRating(cat.id as keyof typeof ratings, score)}>
                                            <div className={clsx(
                                                "absolute inset-1 rounded-md transition-all border border-transparent flex items-center justify-center text-xs font-bold",
                                                ratings[cat.id as keyof typeof ratings] >= score 
                                                    ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 scale-110 shadow-md" 
                                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700"
                                            )}>
                                                {score}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Journal Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-emerald-500" /> Wins for the Day
                        </label>
                        <textarea 
                            value={wins}
                            onChange={e => setWins(e.target.value)}
                            placeholder="I crushed my 3x10 bench press and finished the DSA tree problems..."
                            className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-slate-400 transition-shadow"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-500" /> Lessons & Adjustments
                        </label>
                        <textarea 
                            value={lessons}
                            onChange={e => setLessons(e.target.value)}
                            placeholder="Spent too much time on Instagram in the morning. Better put phone away at 9AM..."
                            className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400 transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl shadow-xl transition-all font-black text-lg active:scale-95 group">
                        <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> 
                        Save Journal Entry
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
