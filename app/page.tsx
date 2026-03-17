'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Activity, CheckCircle2, Zap, ArrowRight, PlayCircle, Star, Quote } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  return (
    <main className="flex-1 min-h-screen selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-[#020617]">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/10 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white/10 text-white font-bold text-sm mb-10 shadow-xl shadow-blue-500/10 border border-slate-800 dark:border-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Built for the Top 1% of High Achievers
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-slate-900 dark:text-white">
            Dominate your day.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Automate your success.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Stop making to-do lists. Start executing <span className="text-slate-900 dark:text-white font-bold">Master Routines</span>. A hyper-focused OS for deep work, habit consistency, and daily reflection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-lg transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 group"
            >
              Enter the Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-slate-800/80 font-bold text-lg transition-all flex items-center justify-center gap-3 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
              <PlayCircle className="w-6 h-6 text-blue-500" /> Watch the Flow
            </button>
          </div>
        </motion.div>
      </section>

      {/* The Flow Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">The 3-Step Execution Protocol</h2>
            <p className="text-xl text-slate-500 font-medium">How the elite turn intention into undeniable results.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Master Routine',
                desc: 'Break your day into strategic blocks: Morning, Afternoon, Evening. Assign reusable templates and map out subtasks.',
                icon: Target,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              {
                step: '02',
                title: 'Deep Work Hub',
                desc: 'Launch a Pomodoro focus session directly from your planner. Eliminate distractions, enter flow state, crush the task.',
                icon: Zap,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              },
              {
                step: '03',
                title: 'Daily Reflection',
                desc: 'End the day with brutal honesty. Rate your sleep, diet, and deep work output. Log wins and adapt for tomorrow.',
                icon: Activity,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative glass-card p-10 group hover:-translate-y-2 transition-transform duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-900/5 dark:text-white/5 pointer-events-none transition-transform group-hover:scale-110">
                  {feature.step}
                </div>
                <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner", feature.bg)}>
                  <feature.icon className={clsx("w-8 h-8", feature.color)} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced UI Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-blue-600 rounded-[3rem] opacity-[0.02] dark:opacity-[0.05] pointer-events-none -skew-y-2 transform origin-left"></div>
        <div className="relative glass-card rounded-3xl p-4 md:p-8 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 lg:p-10">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Analytics that hold you accountable.</h2>
              <p className="text-xl text-slate-500 font-medium">We don't do fluffy metrics. We track Consistency Heatmaps and total Deep Work hours to mathematically guarantee you are moving forward.</p>
              
              <ul className="space-y-4">
                {['GitHub-style Consistency Heatmaps', 'Deep Work Hourly Distribution', 'Win/Loss Ratio Logging'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 blur-3xl opacity-20 dark:opacity-40 animate-blob"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 transform group-hover:-rotate-2 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold">Deep Work Total</div>
                  <div className="text-blue-500 font-black text-xl">142h</div>
                </div>
                {/* Mock Heatmap */}
                <div className="grid grid-cols-10 gap-1.5 opacity-80 backdrop-blur">
                  {Array.from({length: 40}).map((_, i) => (
                    <div key={i} className={clsx(
                      "aspect-square rounded-[3px]",
                      i % 7 === 0 ? "bg-emerald-500" : i % 5 === 0 ? "bg-emerald-400" : i % 3 === 0 ? "bg-emerald-200" : "bg-slate-100 dark:bg-slate-800"
                    )}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Love */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">Loved by high performers.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { tag: "@sarahCodes", body: "Moved all my Notion setups and habit tick-boxes here. The Master Routine flow is literally how I passed my exams.", rating: 5 },
            { tag: "@alex_med", body: "The Pomodoro timer ripping context directly from my planner saves me 10 clicks a day. Flawless execution.", rating: 5 },
            { tag: "@jake_dev", body: "It's aggressive, opinionated, and removes all the fluff. Exactly what you need when you're aiming for the top 1%.", rating: 5 },
          ].map((t, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-8 text-left border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-1 mb-6">
                {Array.from({length: t.rating}).map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-6 relative z-10">"{t.body}"</p>
              <div className="font-bold text-slate-900 dark:text-white">{t.tag}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative text-center px-4">
        <div className="absolute inset-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 clip-path-slant z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white dark:text-slate-900">It's time to join the 1%.</h2>
          <p className="text-xl md:text-2xl font-medium mb-12 text-slate-400 dark:text-slate-600">No credit card required. Master your routine today.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            Create Free Account <Zap className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </main>
  );
}
