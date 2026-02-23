'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, CheckCircle2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function StudyTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setSessions((s) => s + 1);
            setTimeLeft(5 * 60); // Break time
            // Here you would trigger notification
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    return (
        <div className="space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Focus Mode</h1>
                <p className="text-slate-500">Eliminate distractions. Boost productivity.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12 w-full max-w-md relative flex flex-col items-center"
            >
                <div className="absolute top-4 right-4">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Timer Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={120 * 2 * Math.PI}
                            strokeDashoffset={120 * 2 * Math.PI - (progress / 100) * 120 * 2 * Math.PI}
                            className="text-blue-500 transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="text-center z-10 font-mono tracking-tighter">
                        <span className="text-6xl font-black">{minutes.toString().padStart(2, '0')}</span>
                        <span className="text-4xl text-slate-400 mx-1">:</span>
                        <span className="text-6xl font-black">{seconds.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={clsx(
                            "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 group",
                            isActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                        )}
                    >
                        {isActive ? <Pause className="w-8 h-8 group-hover:scale-90 transition-transform" /> : <Play className="w-8 h-8 ml-1 group-hover:scale-90 transition-transform" />}
                    </button>

                    <button
                        onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
                        className="w-12 h-12 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 group border border-slate-200 dark:border-slate-700"
                    >
                        <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Status */}
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</span>
                        <span className="flex items-center gap-1.5 font-medium"><BookOpen className="w-4 h-4 text-blue-500" /> Data Structures</span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</span>
                        <span className="flex items-center gap-1.5 font-medium justify-end"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {sessions}/4</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
