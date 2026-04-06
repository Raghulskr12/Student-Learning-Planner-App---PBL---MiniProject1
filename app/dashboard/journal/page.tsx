'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Send, Moon, Trophy, Target, Activity, Coffee, CheckCircle2, Edit3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { submitJournalEntry, getTodayJournalEntry } from '@/app/actions/journal';

export default function DailyJournal() {
    const [ratings, setRatings] = useState({ workout: 0, studies: 0, diet: 0, sleep: 0 });
    const [wins, setWins] = useState('');
    const [lessons, setLessons] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');
    const [hasExisting, setHasExisting] = useState(false);
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const categories = [
        { id: 'workout', label: 'Workout & Gym', icon: Activity, color: 'text-blue-500', activeColor: 'bg-blue-500', activeBg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'studies', label: 'Deep Work', icon: Target, color: 'text-purple-500', activeColor: 'bg-purple-500', activeBg: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'diet', label: 'Diet & Nutrition', icon: Coffee, color: 'text-orange-500', activeColor: 'bg-orange-500', activeBg: 'bg-orange-50 dark:bg-orange-900/20' },
        { id: 'sleep', label: 'Sleep & Recovery', icon: Moon, color: 'text-emerald-500', activeColor: 'bg-emerald-500', activeBg: 'bg-emerald-50 dark:bg-emerald-900/20' }
    ];

    useEffect(() => {
        async function loadEntry() {
            setLoading(true);
            const res = await getTodayJournalEntry();
            if (res.success && res.data) {
                setRatings(res.data.ratings);
                setWins(res.data.wins || '');
                setLessons(res.data.lessons || '');
                setHasExisting(true);
            }
            setLoading(false);
        }
        loadEntry();
    }, []);

    const handleRating = (category: keyof typeof ratings, score: number) => {
        setRatings(prev => ({ ...prev, [category]: score === prev[category] ? 0 : score }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setStatusMsg('');
        const res = await submitJournalEntry({ ratings, wins, lessons });
        if (res.error) {
            setStatusType('error');
            setStatusMsg(res.error);
        } else {
            setStatusType('success');
            setStatusMsg(hasExisting ? 'Journal entry updated!' : 'Journal entry saved for today!');
            setHasExisting(true);
        }
        setSubmitting(false);
        setTimeout(() => setStatusMsg(''), 4000);
    };

    const getTotalScore = () => Object.values(ratings).reduce((a, b) => a + b, 0);
    const getScoreLabel = (score: number) => {
        if (score >= 32) return { label: 'Exceptional', color: 'text-emerald-500' };
        if (score >= 24) return { label: 'Great', color: 'text-blue-500' };
        if (score >= 16) return { label: 'Average', color: 'text-yellow-500' };
        if (score >= 8) return { label: 'Below Average', color: 'text-orange-500' };
        return { label: 'Not Rated', color: 'text-slate-400' };
    };
    const totalScore = getTotalScore();
    const scoreLabel = getScoreLabel(totalScore);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-500 animate-pulse">Loading journal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Reflection</h1>
                    <p className="text-slate-500 mt-1">{today}</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasExisting && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-semibold">Entry saved today</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <span className="font-semibold text-sm">Evening Routine</span>
                    </div>
                </div>
            </div>

            {/* Overall Score Card */}
            {totalScore > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-5 flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Today's Overall Score</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{totalScore}</span>
                            <span className="text-slate-400 font-bold">/40</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={clsx("text-lg font-black", scoreLabel.color)}>{scoreLabel.label}</span>
                        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(totalScore / 40) * 100}%` }} />
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 space-y-8"
            >
                {/* Ratings */}
                <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> End of Day Ratings
                        <span className="text-sm text-slate-400 font-normal ml-2">Click again to deselect</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {categories.map(cat => {
                            const currentRating = ratings[cat.id as keyof typeof ratings];
                            return (
                                <div key={cat.id} className={clsx("p-5 border rounded-2xl transition-colors", currentRating > 0 ? `border-slate-200 dark:border-slate-700 ${cat.activeBg}` : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50")}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <cat.icon className={clsx("w-5 h-5", cat.color)} /> {cat.label}
                                        </span>
                                        <span className={clsx("font-black text-xl", currentRating > 0 ? cat.color : "text-slate-300 dark:text-slate-700")}>{currentRating}/10</span>
                                    </div>
                                    <div className="flex justify-between gap-1">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                            <button
                                                key={score}
                                                className={clsx(
                                                    "flex-1 h-8 rounded-md transition-all text-xs font-bold border",
                                                    currentRating >= score
                                                        ? `${cat.activeColor} border-transparent text-white shadow-sm`
                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-400 dark:hover:border-slate-500"
                                                )}
                                                onClick={() => handleRating(cat.id as keyof typeof ratings, score)}
                                                title={`Rate ${score}/10`}
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Journal Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-emerald-500" /> Wins for the Day
                        </label>
                        <textarea
                            value={wins}
                            onChange={e => setWins(e.target.value)}
                            placeholder="I crushed my 3x10 bench press and finished the DSA tree problems..."
                            className="w-full h-36 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-slate-400 transition-shadow text-sm"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" /> Lessons & Adjustments
                        </label>
                        <textarea
                            value={lessons}
                            onChange={e => setLessons(e.target.value)}
                            placeholder="Spent too much time on Instagram in the morning. Better put phone away at 9AM..."
                            className="w-full h-36 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400 transition-shadow text-sm"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col items-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <AnimatePresence>
                        {statusMsg && (
                            <motion.span
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={clsx(
                                    "text-sm font-bold px-4 py-2 rounded-lg",
                                    statusType === 'success'
                                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400"
                                )}
                            >
                                {statusMsg}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl shadow-xl transition-all font-black text-base active:scale-95 group disabled:opacity-50"
                    >
                        {hasExisting ? <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> : <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                        {submitting ? 'Saving...' : hasExisting ? 'Update Entry' : 'Save Journal Entry'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
