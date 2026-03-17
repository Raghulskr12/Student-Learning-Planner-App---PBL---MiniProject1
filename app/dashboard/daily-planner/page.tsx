'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, MoreHorizontal, X, CheckSquare, ListTodo, Timer, ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Subtask = { id: number, title: string, checked: boolean };
type RoutineTask = { id: number, title: string, checked: boolean, subtasks: Subtask[], isDeepWork?: boolean };

export default function DailyPlanner() {
    const router = useRouter();

    const [routine, setRoutine] = useState<Record<string, RoutineTask[]>>({
        Morning: [
            { id: 1, title: 'Facewash + Sunscreen', checked: true, subtasks: [] },
            { id: 2, title: '1 egg', checked: true, subtasks: [] },
            { id: 3, title: 'chia seeds water drink', checked: true, subtasks: [] },
            { id: 4, title: 'gym', checked: true, subtasks: [{ id: 101, title: 'Bench Press', checked: true }, { id: 102, title: 'Cardio', checked: false }] },
            { id: 5, title: 'Study 9 - 12:30 (Session 1)', checked: false, isDeepWork: true, subtasks: [{ id: 103, title: 'DSA Practice', checked: false }] },
        ],
        Afternoon: [
            { id: 6, title: 'Study 1:30 - 4:30 (Session 2)', checked: false, isDeepWork: true, subtasks: [] },
            { id: 7, title: '2 Eggs', checked: false, subtasks: [] },
        ],
        Evening: [
            { id: 8, title: 'Shake', checked: true, subtasks: [] },
            { id: 9, title: 'Study 5:30 - 7:45 (Session 3)', checked: false, isDeepWork: true, subtasks: [] },
        ],
        Night: [
            { id: 10, title: 'Facewash + Sunscreen', checked: false, subtasks: [] },
            { id: 11, title: 'Whey Protein', checked: false, subtasks: [] },
            { id: 12, title: 'chia seeds water', checked: false, subtasks: [] },
            { id: 13, title: 'Hair wash (3x week)', checked: false, subtasks: [] },
            { id: 14, title: 'Study or revise 8:30 - (10:30-11) (Session 4)', checked: false, isDeepWork: true, subtasks: [] },
        ]
    });

    const [selectedTask, setSelectedTask] = useState<{ block: string, task: RoutineTask } | null>(null);
    const [newSubtask, setNewSubtask] = useState('');

    const toggleTask = (blockName: string, taskId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setRoutine(prev => ({
            ...prev,
            [blockName]: prev[blockName].map(t => t.id === taskId ? { ...t, checked: !t.checked } : t)
        }));
    };

    const addSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask || !newSubtask.trim()) return;

        const updatedTask = {
            ...selectedTask.task,
            subtasks: [...selectedTask.task.subtasks, { id: Date.now(), title: newSubtask, checked: false }]
        };

        setRoutine(prev => ({
            ...prev,
            [selectedTask.block]: prev[selectedTask.block].map(t => t.id === updatedTask.id ? updatedTask : t)
        }));
        setSelectedTask({ block: selectedTask.block, task: updatedTask });
        setNewSubtask('');
    };

    const toggleSubtask = (subtaskId: number) => {
        if (!selectedTask) return;
        const updatedTask = {
            ...selectedTask.task,
            subtasks: selectedTask.task.subtasks.map(st => st.id === subtaskId ? { ...st, checked: !st.checked } : st)
        };
        setRoutine(prev => ({
            ...prev,
            [selectedTask.block]: prev[selectedTask.block].map(t => t.id === updatedTask.id ? updatedTask : t)
        }));
        setSelectedTask({ block: selectedTask.block, task: updatedTask });
    };

    const deleteSubtask = (subtaskId: number) => {
        if (!selectedTask) return;
        const updatedTask = {
            ...selectedTask.task,
            subtasks: selectedTask.task.subtasks.filter(st => st.id !== subtaskId)
        };
        setRoutine(prev => ({
            ...prev,
            [selectedTask.block]: prev[selectedTask.block].map(t => t.id === updatedTask.id ? updatedTask : t)
        }));
        setSelectedTask({ block: selectedTask.block, task: updatedTask });
    };

    const handleDeepWork = () => {
        if (!selectedTask) return;
        router.push(`/dashboard/study-timer?taskCtx=${encodeURIComponent(selectedTask.task.title)}`);
    };

    return (
        <div className="space-y-8 relative pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Master Routine</h1>
                    <p className="text-slate-500 mt-1">Your unified template for maximum daily productivity.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-medium transition-colors">
                        Save as Template
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium active:scale-95">
                        <Plus className="w-4 h-4" /> Load Template
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(routine).map(([blockName, tasks], i) => (
                    <motion.div
                        key={blockName}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col h-full"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold">{blockName} Session</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                {tasks.filter(t => t.checked).length}/{tasks.length}
                            </span>
                        </div>
                        <div className="p-4 space-y-2 flex-1">
                            {tasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    onClick={() => setSelectedTask({ block: blockName, task })}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group shadow-sm bg-white dark:bg-slate-900 relative"
                                >
                                    <button 
                                        onClick={(e) => toggleTask(blockName, task.id, e)}
                                        className={clsx(
                                            "w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center transition-colors mt-0.5",
                                            task.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700 text-transparent hover:border-blue-500"
                                        )}
                                    >
                                        <CheckSquare className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="flex-1 min-w-0 pr-8">
                                        <span className={clsx(
                                            "font-medium transition-all block truncate",
                                            task.checked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200",
                                            task.isDeepWork && !task.checked && "text-purple-600 dark:text-purple-400 font-bold"
                                        )}>
                                            {task.title}
                                        </span>
                                        {task.subtasks.length > 0 && (
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 h-full rounded-full transition-all" 
                                                    style={{ width: `${(task.subtasks.filter(s => s.checked).length / task.subtasks.length) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {task.isDeepWork && (
                                        <span className="absolute top-4 right-4 shrink-0 p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors" title="Deep Work Linked">
                                            <Timer className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            ))}
                            <button className="w-full text-left px-4 py-3 mt-4 border border-dashed border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center gap-2 transition-all">
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Subtask Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                                        {selectedTask.block} Block
                                    </span>
                                    <button
                                        onClick={() => setSelectedTask(null)}
                                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <h2 className="text-3xl font-black mt-2 text-slate-900 dark:text-white leading-tight pr-8">
                                    {selectedTask.task.title}
                                </h2>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4 text-lg">
                                        <ListTodo className="w-5 h-5 text-blue-500" /> Subtasks Checklist
                                    </h3>

                                    <div className="space-y-3">
                                        {selectedTask.task.subtasks.map(st => (
                                            <div key={st.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl group border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors">
                                                <button 
                                                    onClick={() => toggleSubtask(st.id)}
                                                    className={clsx(
                                                        "w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all",
                                                        st.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent"
                                                    )}
                                                >
                                                    <CheckSquare className="w-4 h-4" />
                                                </button>
                                                <span className={clsx("flex-1 font-semibold text-lg", st.checked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200")}>
                                                    {st.title}
                                                </span>
                                                <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {selectedTask.task.subtasks.length === 0 && (
                                            <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                                <p className="text-slate-500 font-medium">No subtasks added yet. Break down your work!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={addSubtask} className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <input 
                                        type="text" 
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        placeholder="Add a new step..."
                                        className="flex-1 px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg placeholder:text-slate-400"
                                    />
                                    <button type="submit" disabled={!newSubtask.trim()} className="px-6 py-4 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 disabled:opacity-50 text-white dark:text-slate-900 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </form>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                {selectedTask.task.isDeepWork ? (
                                    <button onClick={handleDeepWork} className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 group">
                                        <Timer className="w-6 h-6 group-hover:animate-pulse" /> Launch Focus Session
                                    </button>
                                ) : (
                                    <button onClick={() => setSelectedTask(null)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold text-lg transition-all active:scale-95">
                                        Close Details
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
