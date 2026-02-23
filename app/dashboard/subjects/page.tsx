'use client';

import { motion } from 'framer-motion';
import { BookOpen, MoreVertical, Plus, Trophy } from 'lucide-react';

const subjects = [
    { name: 'Data Structures', code: 'CS301', progress: 85, hours: 120, color: 'from-blue-500 to-blue-600', text: 'text-blue-500' },
    { name: 'Operating Systems', code: 'CS302', progress: 60, hours: 85, color: 'from-purple-500 to-purple-600', text: 'text-purple-500' },
    { name: 'Linear Algebra', code: 'MA201', progress: 45, hours: 40, color: 'from-pink-500 to-pink-600', text: 'text-pink-500' },
    { name: 'Computer Networks', code: 'CS303', progress: 20, hours: 15, color: 'from-emerald-500 to-emerald-600', text: 'text-emerald-500' },
];

export default function SubjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subject Manager</h1>
                    <p className="text-slate-500 mt-1">Manage your courses, syllabus, and track progress.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                    <Plus className="w-4 h-4" /> Add Subject
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                {subjects.map((subject, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer"
                    >
                        <div className={`h-2 w-full bg-gradient-to-r ${subject.color}`}></div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${subject.text}`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold mb-1 group-hover:text-blue-500 transition-colors">{subject.name}</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6">{subject.code}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Completion</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{subject.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subject.progress}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Trophy className="w-4 h-4 text-orange-500" /> {subject.hours}h Studied
                                </div>
                                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    {subject.progress >= 80 ? 'Mastered' : subject.progress >= 50 ? 'On Track' : 'Needs Focus'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: subjects.length * 0.1 }}
                    className="glass-card border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[300px] group"
                >
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New Subject</h3>
                </motion.div>
            </div>
        </div>
    );
}
