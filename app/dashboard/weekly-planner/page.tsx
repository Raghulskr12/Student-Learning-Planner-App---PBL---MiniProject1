'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Save, Edit2, Check, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/actions/user';
import clsx from 'clsx';
import Link from 'next/link';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
    Monday: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-l-blue-500', icon: '💼' },
    Tuesday: { bg: 'from-indigo-500/10 to-indigo-500/5', border: 'border-l-indigo-500', icon: '📚' },
    Wednesday: { bg: 'from-violet-500/10 to-violet-500/5', border: 'border-l-violet-500', icon: '⚡' },
    Thursday: { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-l-purple-500', icon: '🧠' },
    Friday: { bg: 'from-pink-500/10 to-pink-500/5', border: 'border-l-pink-500', icon: '🚀' },
    Saturday: { bg: 'from-orange-500/10 to-orange-500/5', border: 'border-l-orange-500', icon: '🏋️' },
    Sunday: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-l-emerald-500', icon: '🌿' },
};

const TEMPLATE_SUGGESTIONS = [
    'College Day Template',
    'Light Day Template',
    'Project Day',
    'Weekend Grind',
    'Rest & Reset',
    'Study Marathon',
    'Admin & Errands',
    'Creative Work',
    'Deep Work Only',
    'Recovery Day',
];

export default function WeeklyPlanner() {
    const [templates, setTemplates] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        async function loadData() {
            const res = await getUserProfile();
            if (res.success && res.data?.weeklyPlan) {
                setTemplates(res.data.weeklyPlan);
            } else {
                setTemplates({
                    Monday: 'College Day Template',
                    Tuesday: 'College Day Template',
                    Wednesday: 'Light Day Template',
                    Thursday: 'College Day Template',
                    Friday: 'Project Day',
                    Saturday: 'Weekend Grind',
                    Sunday: 'Rest & Reset',
                });
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await updateUserProfile({ weeklyPlan: templates });
        if (res.success) {
            setStatusMsg('Weekly plan saved!');
        } else {
            setStatusMsg('Failed to save.');
        }
        setTimeout(() => setStatusMsg(''), 3000);
        setSaving(false);
    };

    const startEdit = (day: string) => {
        setEditingDay(day);
        setTempValue(templates[day] || '');
        setShowSuggestions(true);
    };

    const saveEdit = () => {
        if (!editingDay) return;
        setTemplates(prev => ({ ...prev, [editingDay]: tempValue }));
        setEditingDay(null);
        setShowSuggestions(false);
    };

    const cancelEdit = () => {
        setEditingDay(null);
        setShowSuggestions(false);
    };

    const today = new Date();
    const WEEKDAY_NAMES: Record<number, string> = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday' };
    const todayName = WEEKDAY_NAMES[today.getDay()];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-500 animate-pulse">Loading your week...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 relative">
            {/* Status Toast */}
            <AnimatePresence>
                {statusMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-20 right-6 z-50 px-5 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" /> {statusMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Overview</h1>
                    <p className="text-slate-500 mt-1">Assign master routines to each day of the week.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-bold active:scale-95 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Week'}
                </button>
            </div>

            {/* Today's pill */}
            <div className="flex items-center gap-3 p-4 glass-card border border-blue-500/20 bg-blue-500/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-blue-500 font-bold uppercase tracking-wide">Today is {todayName}</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{templates[todayName] || 'No template set'}</p>
                </div>
                <Link
                    href="/dashboard/daily-planner"
                    className="ml-auto flex items-center gap-1 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
                >
                    Open Planner <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {DAYS.map((day, i) => {
                    const colors = DAY_COLORS[day];
                    const isToday = day === todayName;
                    const isEditing = editingDay === day;

                    return (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={clsx(
                                "glass-card border-l-4 overflow-hidden flex flex-col min-h-[180px] transition-all",
                                colors.border,
                                isToday && "ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10"
                            )}
                        >
                            {/* Card Header */}
                            <div className={clsx("p-4 border-b border-slate-100 dark:border-slate-800/50 bg-gradient-to-r flex justify-between items-center", colors.bg)}>
                                <h2 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <span>{colors.icon}</span>
                                    <span>{day}</span>
                                    {isToday && (
                                        <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Today</span>
                                    )}
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => startEdit(day)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                        title="Edit template"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-1 flex flex-col justify-center">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all"
                                            value={tempValue}
                                            onChange={e => setTempValue(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                                            autoFocus
                                            placeholder="e.g., Study Day"
                                        />
                                        {showSuggestions && (
                                            <div className="space-y-1 max-h-36 overflow-y-auto">
                                                {TEMPLATE_SUGGESTIONS.filter(s => s.toLowerCase().includes(tempValue.toLowerCase())).map(suggestion => (
                                                    <button
                                                        key={suggestion}
                                                        onClick={() => { setTempValue(suggestion); }}
                                                        className={clsx(
                                                            "w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                                                            tempValue === suggestion
                                                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                                <Check className="w-3.5 h-3.5" /> Save
                                            </button>
                                            <button onClick={cancelEdit} className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex flex-col items-center text-center cursor-pointer group"
                                        onClick={() => startEdit(day)}
                                    >
                                        <p className={clsx(
                                            "font-bold text-slate-800 dark:text-slate-200 mb-2",
                                            templates[day] ? "" : "text-slate-400"
                                        )}>
                                            {templates[day] || 'No template set'}
                                        </p>
                                        <p className="text-xs font-semibold text-slate-400 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                                            <Edit2 className="w-3 h-3" /> Click to edit
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Tips Card */}
            <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xl">💡</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Plan Your Week Like a Pro</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Assign a routine template to each day. On college days, load your "College Day Template". Reserve weekends for grind sessions or recovery. Click any day card to edit its template.
                    </p>
                </div>
            </div>
        </div>
    );
}
