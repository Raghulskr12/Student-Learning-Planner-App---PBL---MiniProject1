'use client';

import { motion } from 'framer-motion';
import { Calendar, Plus, Save, MoreHorizontal } from 'lucide-react';

export default function WeeklyPlanner() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentTemplates = {
        'Monday': 'College Day Template',
        'Tuesday': 'College Day Template',
        'Wednesday': 'Light Day Template',
        'Thursday': 'College Day Template',
        'Friday': 'Project Day',
        'Saturday': 'Weekend Grind',
        'Sunday': 'Rest & Reset'
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Overview</h1>
                    <p className="text-slate-500 mt-1">Assign master routines to your week.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-bold active:scale-95">
                        <Save className="w-4 h-4" /> Save Week
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {days.map((day, i) => (
                    <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col min-h-[250px]"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" /> {day}
                            </h2>
                            <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                                {currentTemplates[day as keyof typeof currentTemplates]}
                            </h3>
                            <button className="text-sm font-semibold text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 mt-2 hover:underline">
                                Change Template
                            </button>
                        </div>
                    </motion.div>
                ))}
                
                {/* Empty State for Add New Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 7 * 0.05 }}
                    className="glass-card border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[250px] items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all"
                >
                    <Plus className="w-10 h-10 mb-2" />
                    <span className="font-bold">Plan Next Week</span>
                </motion.div>
            </div>
        </div>
    );
}
