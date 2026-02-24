'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, CheckCircle2, BookOpen, Volume2, VolumeX, Coffee, Maximize, Minimize } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

const QUOTES = [
    "The secret of your future is hidden in your daily routine.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done.",
    "Focus on being productive instead of busy.",
    "You don't have to be great to start, but you have to start to be great.",
    "The way to get started is to quit talking and begin doing.",
    "Discipline is choosing between what you want now and what you want most."
];

export default function StudyTimer() {
    const [selectedMinutes, setSelectedMinutes] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create audio element for notification
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = 0.5;
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

    const toggleTimer = () => {
        if (!isActive) {
            setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
            if (mode === 'focus' && !isFullscreen) {
                toggleFullscreen();
            }
        }
        setIsActive(!isActive);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (soundEnabled && audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            if (mode === 'focus') {
                setSessions((s) => s + 1);
                setMode('break');
                setSelectedMinutes(5);
                setTimeLeft(5 * 60);
            } else {
                setMode('focus');
                setSelectedMinutes(25);
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, soundEnabled, mode]);

    const handleSetTime = (mins: number) => {
        setIsActive(false);
        setSelectedMinutes(mins);
        setTimeLeft(mins * 60);
    };

    return (
        <div ref={containerRef} className={clsx(
            "space-y-6 flex flex-col items-center justify-center py-6 relative transition-all duration-500",
            isFullscreen ? "fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 px-4" : "min-h-[calc(100vh-8rem)]"
        )}>
            {/* Background elements for fullscreen mode to keep it pretty */}
            {isFullscreen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-0 -right-64 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {isFullscreen && isActive && mode === 'focus' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 right-0 max-w-2xl mx-auto text-center px-4"
                    >
                        <p className="text-xl md:text-2xl font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
                            "{currentQuote}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
                </h1>
                <p className="text-slate-500">
                    {mode === 'focus' ? 'Eliminate distractions. Boost productivity.' : 'Relax and recharge.'}
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-10 w-full max-w-md relative flex flex-col items-center"
            >
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="absolute top-4 left-4 flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                        onClick={() => handleSetTime(25)}
                        className={clsx("px-3 py-1 text-xs font-semibold rounded-md transition-colors", mode === 'focus' && selectedMinutes === 25 ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}
                    >
                        Pomodoro
                    </button>
                    <button
                        onClick={() => handleSetTime(5)}
                        className={clsx("px-3 py-1 text-xs font-semibold rounded-md transition-colors", mode === 'break' && selectedMinutes === 5 ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}
                    >
                        Short Break
                    </button>
                </div>

                {/* Timer Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-10 mt-6">
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
                            className={clsx("transition-all duration-1000 ease-linear", mode === 'break' ? "text-emerald-500" : "text-blue-500")}
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
                        onClick={toggleTimer}
                        className={clsx(
                            "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 group",
                            isActive
                                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                                : mode === 'break' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                        )}
                    >
                        {isActive ? <Pause className="w-8 h-8 group-hover:scale-90 transition-transform" /> : <Play className="w-8 h-8 ml-1 group-hover:scale-90 transition-transform" />}
                    </button>

                    <button
                        onClick={() => { setIsActive(false); setTimeLeft(selectedMinutes * 60); }}
                        className="w-12 h-12 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 group border border-slate-200 dark:border-slate-700"
                    >
                        <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="w-12 h-12 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 group border border-slate-200 dark:border-slate-700"
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5 group-hover:scale-90 transition-transform" /> : <Maximize className="w-5 h-5 group-hover:scale-90 transition-transform" />}
                    </button>
                </div>

                {/* Status */}
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Focus</span>
                        <span className={clsx("flex items-center gap-1.5 font-medium", mode === 'break' ? "text-emerald-500" : "text-blue-500")}>
                            {mode === 'focus' ? <BookOpen className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                            {mode === 'focus' ? 'Data Structures' : 'Relaxing'}
                        </span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</span>
                        <span className="flex items-center gap-1.5 font-medium justify-end text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {sessions} Completed</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
