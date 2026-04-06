'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Maximize, Minimize, CheckCircle2, BookOpen, Zap } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { logDeepWorkSession } from '@/app/actions/analytics';

const QUOTES = [
    "The secret of your future is hidden in your daily routine.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done.",
    "Focus on being productive instead of busy.",
    "You don't have to be great to start, but you have to start to be great.",
    "The way to get started is to quit talking and begin doing.",
    "Discipline is choosing between what you want now and what you want most.",
    "Deep work is the ability to focus without distraction on a cognitively demanding task.",
    "You are what you repeatedly do. Excellence is not an act, but a habit.",
];

function StudyTimerContent() {
    const searchParams = useSearchParams();
    const taskCtx = searchParams.get('taskCtx') || 'Deep Work Session';

    const [selectedMinutes, setSelectedMinutes] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [savingSession, setSavingSession] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const quotesContainerRef = useRef<HTMLDivElement | null>(null);
    const sessionStartRef = useRef<number | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.volume = 0.5;
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // GSAP Marquee Effect
    useEffect(() => {
        if (isFullscreen && isActive && mode === 'focus' && marqueeRef.current && quotesContainerRef.current) {
            const containerWidth = quotesContainerRef.current.offsetWidth;
            gsap.set(marqueeRef.current, { x: '100vw' });
            const ctx = gsap.context(() => {
                gsap.to(marqueeRef.current, {
                    x: -containerWidth,
                    duration: 70,
                    ease: "none",
                    repeat: -1,
                });
            });
            return () => ctx.revert();
        }
    }, [isFullscreen, isActive, mode]);

    const saveCompletedSession = async (sessionMinutes: number) => {
        setSavingSession(true);
        await logDeepWorkSession(sessionMinutes);
        setSavingSession(false);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (soundEnabled && audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            if (mode === 'focus') {
                // Save completed session to DB
                const elapsed = sessionStartRef.current
                    ? Math.round((Date.now() - sessionStartRef.current) / 60000)
                    : selectedMinutes;
                saveCompletedSession(elapsed);
                setTotalMinutes(m => m + selectedMinutes);
                setSessions(s => s + 1);
                setMode('break');
                setSelectedMinutes(5);
                setTimeLeft(5 * 60);
            } else {
                setMode('focus');
                setSelectedMinutes(25);
                setTimeLeft(25 * 60);
            }
            sessionStartRef.current = null;
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, soundEnabled, mode]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

    const toggleTimer = () => {
        if (!isActive) {
            // Starting
            sessionStartRef.current = Date.now();
            if (mode === 'focus' && !isFullscreen) toggleFullscreen();
        } else {
            // Pausing – if focus mode, save partial session
            if (mode === 'focus' && sessionStartRef.current) {
                const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60000);
                if (elapsed >= 1) saveCompletedSession(elapsed);
                sessionStartRef.current = null;
            }
        }
        setIsActive(prev => !prev);
    };

    const handleReset = () => {
        if (isActive && mode === 'focus' && sessionStartRef.current) {
            const elapsed = Math.round((Date.now() - sessionStartRef.current) / 60000);
            if (elapsed >= 1) saveCompletedSession(elapsed);
        }
        setIsActive(false);
        setTimeLeft(selectedMinutes * 60);
        sessionStartRef.current = null;
    };

    const handleSetTime = (mins: number, newMode: 'focus' | 'break' = 'focus') => {
        handleReset();
        setSelectedMinutes(mins);
        setTimeLeft(mins * 60);
        setMode(newMode);
    };

    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;

    return (
        <div ref={containerRef} className={clsx(
            "flex flex-col items-center justify-center py-6 relative transition-all duration-500",
            isFullscreen
                ? "fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 px-4"
                : "min-h-[calc(100vh-8rem)] space-y-6"
        )}>
            {/* Fullscreen Background */}
            {isFullscreen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 -left-64 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-0 -right-64 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                </div>
            )}

            {/* GSAP Marquee */}
            {isFullscreen && isActive && mode === 'focus' && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full overflow-hidden flex items-center h-40 pointer-events-none z-0 opacity-[0.07] dark:opacity-[0.12] select-none">
                    <div ref={marqueeRef} className="flex whitespace-nowrap min-w-max">
                        <div ref={quotesContainerRef} className="flex items-center gap-32 px-32">
                            {[...QUOTES, ...QUOTES].map((quote, idx) => (
                                <span key={idx} className="text-5xl md:text-8xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                                    {quote}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mode & Task Header */}
            <div className="text-center z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                    {mode === 'focus' ? '🧠 Focus Mode' : '☕ Break Time'}
                </h1>
                <p className="text-slate-500 font-medium">
                    {mode === 'focus' ? taskCtx : 'Relax. You earned it.'}
                </p>
            </div>

            {/* Timer Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-10 w-full max-w-md relative flex flex-col items-center z-10"
            >
                {/* Top Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setSoundEnabled(s => !s)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={soundEnabled ? 'Mute sound' : 'Enable sound'}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="absolute top-4 left-4 flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {[
                        { label: 'Pomodoro', mins: 25, m: 'focus' as const },
                        { label: '45 min', mins: 45, m: 'focus' as const },
                        { label: 'Break', mins: 5, m: 'break' as const },
                    ].map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => handleSetTime(opt.mins, opt.m)}
                            className={clsx(
                                "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
                                selectedMinutes === opt.mins && mode === opt.m
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Progress Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-8 mt-8">
                    <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                        <circle cx="128" cy="128" r="116" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                        <circle
                            cx="128" cy="128" r="116"
                            stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={116 * 2 * Math.PI}
                            strokeDashoffset={116 * 2 * Math.PI - (progress / 100) * 116 * 2 * Math.PI}
                            className={clsx("transition-all duration-1000 ease-linear", mode === 'break' ? "text-emerald-500" : "text-blue-500")}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="text-center z-10 font-mono">
                        <div className="text-6xl font-black tracking-tighter">
                            {minutes.toString().padStart(2, '0')}
                            <span className="text-slate-400 mx-1 text-4xl">:</span>
                            {seconds.toString().padStart(2, '0')}
                        </div>
                        <div className={clsx("text-sm font-bold mt-1 uppercase tracking-wider", mode === 'break' ? "text-emerald-500" : "text-blue-500")}>
                            {mode === 'focus' ? 'Focus' : 'Break'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={toggleTimer}
                        className={clsx(
                            "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95",
                            isActive
                                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                                : mode === 'break'
                                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                        )}
                    >
                        {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-12 h-12 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
                        title="Reset timer"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Session Info */}
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Focus Task</span>
                        <span className={clsx("flex items-center gap-1.5 font-medium text-sm", mode === 'break' ? "text-emerald-500" : "text-blue-500")}>
                            {mode === 'focus' ? <BookOpen className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                            {mode === 'focus' ? taskCtx : 'On a break'}
                        </span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions Done</span>
                        <span className="flex items-center gap-1.5 font-bold justify-end text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {sessions}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Row */}
            {sessions > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-card border border-slate-200/50 dark:border-slate-800/50 p-5 flex items-center justify-between z-10"
                >
                    <div className="flex flex-col items-center gap-1">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-xl font-black">{sessions}</span>
                        <span className="text-xs text-slate-500 font-semibold uppercase">Sessions</span>
                    </div>
                    <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <span className="text-xl font-black">
                            {totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${totalMins}m`}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold uppercase">Focus Time</span>
                    </div>
                    <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-xl font-black">{savingSession ? '...' : '✓'}</span>
                        <span className="text-xs text-slate-500 font-semibold uppercase">Saved</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default function StudyTimer() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-500">Loading timer...</p>
                </div>
            </div>
        }>
            <StudyTimerContent />
        </Suspense>
    );
}
