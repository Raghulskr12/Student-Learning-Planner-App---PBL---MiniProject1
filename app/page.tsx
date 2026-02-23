'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Timer, BarChart, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 pt-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-medium text-sm mb-8 border border-blue-500/20">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            The Ultimate Student Planner
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Plan Your Day. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Master Your Future.
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Notion meets Google Calendar meets Habit Tracker. Built specifically for students to ace exams, build consistency, and defeat procrastination.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-full glass-card hover:bg-white/40 dark:hover:bg-slate-800/60 font-semibold text-lg transition-all"
            >
              View Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive suite of tools designed to maximize your productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Calendar,
              title: 'Smart Scheduling',
              desc: 'Plan your day hour-by-hour. Drag and drop UI.',
              color: 'text-blue-500',
              bg: 'bg-blue-500/10'
            },
            {
              icon: Timer,
              title: 'Focus Timer',
              desc: 'Built-in Pomodoro timer to track deep work sessions.',
              color: 'text-purple-500',
              bg: 'bg-purple-500/10'
            },
            {
              icon: BarChart,
              title: 'Analytics',
              desc: 'Visual insights into your study habits and consistency.',
              color: 'text-pink-500',
              bg: 'bg-pink-500/10'
            },
            {
              icon: Target,
              title: 'Goal Tracking',
              desc: 'Set and crush daily, weekly, and semester-long goals.',
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 border-t border-white/20 hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card relative rounded-3xl overflow-hidden border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10"></div>
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
              {/* Mock Dashboard Preview */}
              <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 grid md:grid-cols-3 gap-6 opacity-80 backdrop-blur-sm">
                  <div className="col-span-2 space-y-4">
                    <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    <div className="h-64 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    <div className="h-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Top Students</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah J.', role: 'Computer Science Major', text: 'This planner completely changed how I study for exams. I went from scattered notes to a structured 4.0 GPA.' },
            { name: 'Mike T.', role: 'Medical Student', text: 'The Pomodoro timer integrated with the task list is a game-changer for long study sessions.' },
            { name: 'Emily R.', role: 'High School Senior', text: 'Finally an app that looks amazing and actually helps me stop procrastinating!' }
          ].map((testimonial, i) => (
            <div key={i} className="glass-card p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-serif">"</div>
              <p className="text-slate-600 dark:text-slate-300 italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <span className="text-sm text-slate-500">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to Master Your Future?</h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-transform hover:-translate-y-1 shadow-lg"
          >
            Create Your Free Account
          </Link>
          <p className="mt-8 text-slate-500 text-sm">© 2026 The 1% Club. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
