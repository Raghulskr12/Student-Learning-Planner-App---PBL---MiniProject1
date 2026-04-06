'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, X, CheckSquare, ListTodo, Timer, Trash2, Clock, Save, Pencil, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMasterRoutine, saveMasterRoutine, getTodayDailyLog, saveDailyLog } from '@/app/actions/routine';

type Subtask = { _id?: string; title: string; checked: boolean };
type Task = {
    _id?: string;
    title: string;
    startTime: string;
    endTime: string;
    checked: boolean;
    subtasks: Subtask[];
    isDeepWork: boolean;
};
type Schedule = Record<string, Task[]>;

const BLOCK_COLORS: Record<string, string> = {
    Morning: 'border-amber-400',
    Afternoon: 'border-blue-500',
    Evening: 'border-purple-500',
    Night: 'border-indigo-600',
};
const BLOCK_HEADER_COLORS: Record<string, string> = {
    Morning: 'from-amber-500/10 to-amber-500/5',
    Afternoon: 'from-blue-500/10 to-blue-500/5',
    Evening: 'from-purple-500/10 to-purple-500/5',
    Night: 'from-indigo-500/10 to-indigo-500/5',
};
const BLOCK_ICONS: Record<string, string> = {
    Morning: '🌅',
    Afternoon: '☀️',
    Evening: '🌆',
    Night: '🌙',
};

export default function DailyPlanner() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<'today' | 'template'>('today');

    const [todayLog, setTodayLog] = useState<Schedule>({ Morning: [], Afternoon: [], Evening: [], Night: [] });
    const [masterRoutine, setMasterRoutine] = useState<Schedule>({ Morning: [], Afternoon: [], Evening: [], Night: [] });
    
    const schedule = mode === 'today' ? todayLog : masterRoutine;
    const setSchedule = mode === 'today' ? setTodayLog : setMasterRoutine;

    const [selectedTask, setSelectedTask] = useState<{ block: string; taskIdx: number } | null>(null);
    const [newSubtask, setNewSubtask] = useState('');

    // Add task modal
    const [addingToBlock, setAddingToBlock] = useState<string | null>(null);
    const [newTask, setNewTask] = useState({ title: '', startTime: '', endTime: '', isDeepWork: false });

    const mapToSchedule = (r: any): Schedule => ({
        Morning: r.morning || [],
        Afternoon: r.afternoon || [],
        Evening: r.evening || [],
        Night: r.night || [],
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [routineRes, logRes] = await Promise.all([getMasterRoutine(), getTodayDailyLog()]);
            if (routineRes.success && routineRes.routine) {
                setMasterRoutine(mapToSchedule(routineRes.routine));
            }
            if (logRes.success && logRes.dailyLog) {
                setTodayLog(mapToSchedule(logRes.dailyLog));
            } else if (logRes.success && !logRes.dailyLog && routineRes.success && routineRes.routine) {
                // No log yet today – seed from routine
                setTodayLog(mapToSchedule(routineRes.routine));
            }
            setLoading(false);
        }
        load();
    }, []);

    const toggleTask = (blockName: string, taskIdx: number) => {
        setSchedule(prev => {
            const tasks = [...prev[blockName]];
            tasks[taskIdx] = { ...tasks[taskIdx], checked: !tasks[taskIdx].checked };
            return { ...prev, [blockName]: tasks };
        });
    };

    const toggleSubtask = (blockName: string, taskIdx: number, subtaskIdx: number) => {
        setSchedule(prev => {
            const tasks = [...prev[blockName]];
            const subtasks = [...tasks[taskIdx].subtasks];
            subtasks[subtaskIdx] = { ...subtasks[subtaskIdx], checked: !subtasks[subtaskIdx].checked };
            tasks[taskIdx] = { ...tasks[taskIdx], subtasks };
            return { ...prev, [blockName]: tasks };
        });
    };

    const addSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask || !newSubtask.trim()) return;
        const { block, taskIdx } = selectedTask;
        setSchedule(prev => {
            const tasks = [...prev[block]];
            const subtasks = [...tasks[taskIdx].subtasks, { title: newSubtask.trim(), checked: false }];
            tasks[taskIdx] = { ...tasks[taskIdx], subtasks };
            return { ...prev, [block]: tasks };
        });
        setNewSubtask('');
    };

    const deleteSubtask = (blockName: string, taskIdx: number, subtaskIdx: number) => {
        setSchedule(prev => {
            const tasks = [...prev[blockName]];
            const subtasks = tasks[taskIdx].subtasks.filter((_, i) => i !== subtaskIdx);
            tasks[taskIdx] = { ...tasks[taskIdx], subtasks };
            return { ...prev, [blockName]: tasks };
        });
        if (selectedTask) {
            setSelectedTask({ ...selectedTask });
        }
    };

    const deleteTask = (blockName: string, taskIdx: number) => {
        setSchedule(prev => {
            const tasks = prev[blockName].filter((_, i) => i !== taskIdx);
            return { ...prev, [blockName]: tasks };
        });
        setSelectedTask(null);
    };

    const addNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingToBlock || !newTask.title.trim()) return;
        const task: Task = {
            title: newTask.title.trim(),
            startTime: newTask.startTime,
            endTime: newTask.endTime,
            isDeepWork: newTask.isDeepWork,
            checked: false,
            subtasks: [],
        };
        setSchedule(prev => ({ ...prev, [addingToBlock]: [...prev[addingToBlock], task] }));
        setNewTask({ title: '', startTime: '', endTime: '', isDeepWork: false });
        setAddingToBlock(null);
    };

    const handleSave = async () => {
        setSaving(true);
        if (mode === 'today') {
            const res = await saveDailyLog({
                morning: todayLog.Morning,
                afternoon: todayLog.Afternoon,
                evening: todayLog.Evening,
                night: todayLog.Night,
            });
            if (res.error) alert('Failed to save. Please try again.');
        } else {
            const res = await saveMasterRoutine({
                Morning: masterRoutine.Morning,
                Afternoon: masterRoutine.Afternoon,
                Evening: masterRoutine.Evening,
                Night: masterRoutine.Night,
            });
            if (res.error) alert('Failed to save template. Please try again.');
        }
        setSaving(false);
    };

    const totalTasks = Object.values(schedule).flat().length;
    const completedTasks = Object.values(schedule).flat().filter(t => t.checked).length;
    const progressPct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const activeSelectedTask = selectedTask
        ? schedule[selectedTask.block]?.[selectedTask.taskIdx]
        : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-500 animate-pulse">Loading your planner...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
                    <p className="text-slate-500 mt-1">
                        {mode === 'today' ? "Today's execution plan" : "Your master routine template"}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setMode('today')}
                            className={clsx("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'today' ? "bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                        >📅 Today</button>
                        <button
                            onClick={() => setMode('template')}
                            className={clsx("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'template' ? "bg-white dark:bg-slate-800 shadow text-purple-600 dark:text-purple-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                        >⚙️ Template</button>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-bold active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {mode === 'today' && (
                <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Today's Progress</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{completedTasks}/{totalTasks} tasks</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-700"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white shrink-0">{progressPct}%</div>
                </div>
            )}

            {/* Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(schedule).map(([blockName, tasks], i) => (
                    <motion.div
                        key={blockName}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className={clsx(
                            "glass-card border-l-4 overflow-hidden flex flex-col",
                            BLOCK_COLORS[blockName]
                        )}
                    >
                        {/* Block Header */}
                        <div className={clsx("p-4 border-b border-slate-100 dark:border-slate-800/50 bg-gradient-to-r flex justify-between items-center", BLOCK_HEADER_COLORS[blockName])}>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span>{BLOCK_ICONS[blockName]}</span> {blockName}
                            </h2>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-white/70 dark:bg-slate-800/70 rounded-full text-slate-600 dark:text-slate-400 backdrop-blur-sm">
                                {tasks.filter(t => t.checked).length}/{tasks.length}
                            </span>
                        </div>

                        {/* Task List */}
                        <div className="p-4 space-y-2 flex-1">
                            <AnimatePresence>
                                {tasks.map((task, taskIdx) => (
                                    <motion.div
                                        key={`${task._id || taskIdx}-${task.title}`}
                                        layout
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => setSelectedTask({ block: blockName, taskIdx })}
                                        className="flex items-start gap-3 p-3.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group bg-white dark:bg-slate-900/30 shadow-sm relative"
                                    >
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleTask(blockName, taskIdx); }}
                                            className={clsx(
                                                "w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all mt-0.5",
                                                task.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-700 hover:border-emerald-500"
                                            )}
                                        >
                                            {task.checked && <Check className="w-3 h-3" />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <span className={clsx(
                                                "font-semibold block",
                                                task.checked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200",
                                                task.isDeepWork && !task.checked && "text-purple-600 dark:text-purple-400"
                                            )}>
                                                {task.title}
                                            </span>
                                            {(task.startTime || task.endTime) && (
                                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {task.startTime}{task.endTime ? ` – ${task.endTime}` : ''}
                                                </span>
                                            )}
                                            {task.subtasks.length > 0 && (
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 h-full rounded-full transition-all"
                                                        style={{ width: `${task.subtasks.length > 0 ? (task.subtasks.filter(s => s.checked).length / task.subtasks.length) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {task.isDeepWork && (
                                            <span className="shrink-0 p-1 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" title="Deep Work">
                                                <Timer className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {tasks.length === 0 && (
                                <div className="py-6 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                    No tasks for this block yet.
                                </div>
                            )}

                            <button
                                onClick={() => setAddingToBlock(blockName)}
                                className="w-full text-sm font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-all mt-2"
                            >
                                <Plus className="w-4 h-4" /> Add Task
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Task Detail Modal */}
            <AnimatePresence>
                {selectedTask && activeSelectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                                            {BLOCK_ICONS[selectedTask.block]} {selectedTask.block} Block
                                        </span>
                                        <h2 className="text-2xl font-black mt-3 text-slate-900 dark:text-white leading-tight">
                                            {activeSelectedTask.title}
                                        </h2>
                                        {(activeSelectedTask.startTime || activeSelectedTask.endTime) && (
                                            <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {activeSelectedTask.startTime} {activeSelectedTask.endTime && `– ${activeSelectedTask.endTime}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => deleteTask(selectedTask.block, selectedTask.taskIdx)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete task"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedTask(null)}
                                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Subtasks */}
                            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <ListTodo className="w-4 h-4 text-blue-500" /> Subtasks
                                </h3>
                                <div className="space-y-2">
                                    {activeSelectedTask.subtasks.map((st, stIdx) => (
                                        <div key={stIdx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group shadow-sm">
                                            <button
                                                onClick={() => toggleSubtask(selectedTask.block, selectedTask.taskIdx, stIdx)}
                                                className={clsx(
                                                    "w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all",
                                                    st.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-500"
                                                )}
                                            >
                                                {st.checked && <Check className="w-3 h-3" />}
                                            </button>
                                            <span className={clsx("flex-1 font-medium", st.checked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200")}>
                                                {st.title}
                                            </span>
                                            <button
                                                onClick={() => deleteSubtask(selectedTask.block, selectedTask.taskIdx, stIdx)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {activeSelectedTask.subtasks.length === 0 && (
                                        <p className="text-sm text-slate-400 text-center py-4 font-medium">No subtasks yet. Break down this task!</p>
                                    )}
                                </div>

                                <form onSubmit={addSubtask} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSubtask}
                                        onChange={e => setNewSubtask(e.target.value)}
                                        placeholder="Add a step..."
                                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                                    />
                                    <button type="submit" disabled={!newSubtask.trim()} className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold disabled:opacity-40 active:scale-95 transition-all">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                {activeSelectedTask.isDeepWork ? (
                                    <Link
                                        href={`/dashboard/study-timer?taskCtx=${encodeURIComponent(activeSelectedTask.title)}`}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        <Timer className="w-5 h-5" /> Launch Focus Session
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            toggleTask(selectedTask.block, selectedTask.taskIdx);
                                            setSelectedTask(null);
                                        }}
                                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Check className="w-5 h-5" />
                                        {activeSelectedTask.checked ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Task Modal */}
            <AnimatePresence>
                {addingToBlock && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    Add Task to {BLOCK_ICONS[addingToBlock]} {addingToBlock}
                                </h2>
                                <button onClick={() => setAddingToBlock(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={addNewTask} className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Task Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="e.g., Complete DSA assignment"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Start Time</label>
                                        <input
                                            type="time"
                                            value={newTask.startTime}
                                            onChange={e => setNewTask({ ...newTask, startTime: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">End Time</label>
                                        <input
                                            type="time"
                                            value={newTask.endTime}
                                            onChange={e => setNewTask({ ...newTask, endTime: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={newTask.isDeepWork}
                                        onChange={e => setNewTask({ ...newTask, isDeepWork: e.target.checked })}
                                        className="w-4 h-4 accent-purple-600"
                                    />
                                    <div>
                                        <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                            <Timer className="w-4 h-4" /> Deep Work Session
                                        </span>
                                        <p className="text-xs text-slate-500">Enable to link this task to the focus timer</p>
                                    </div>
                                </label>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setAddingToBlock(null)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
