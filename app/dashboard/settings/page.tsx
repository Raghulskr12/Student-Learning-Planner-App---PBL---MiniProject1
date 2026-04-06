'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Wand2, MonitorSmartphone, Mail, CheckCircle2, GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { getUserProfile, updateUserProfile, updatePassword } from '@/app/actions/user';
import { useSession } from 'next-auth/react';

interface StatusMsg {
    text: string;
    type: 'success' | 'error';
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={clsx(
                "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                checked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
            )}
        >
            <div className={clsx(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300",
                checked ? "translate-x-6" : "translate-x-0"
            )} />
        </button>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<StatusMsg | null>(null);
    const { update: updateSession } = useSession();

    const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', college: '' });
    const [preferences, setPreferences] = useState({ theme: 'System Default', autoAdvance: true });
    const [notifications, setNotifications] = useState({ dailyReminder: true, weeklyReview: true, deepWorkChime: true });
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showPw, setShowPw] = useState({ new: false, confirm: false });

    useEffect(() => {
        async function loadProfile() {
            const res = await getUserProfile();
            if (res.success && res.data) {
                const names = res.data.name?.split(' ') || ['User'];
                setProfile({
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    email: res.data.email || '',
                    college: res.data.college || '',
                });
                if (res.data.preferences) setPreferences(res.data.preferences);
                if (res.data.notifications) setNotifications(res.data.notifications);
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const showStatus = (text: string, type: 'success' | 'error') => {
        setStatus({ text, type });
        setTimeout(() => setStatus(null), 3000);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        const res = await updateUserProfile({ name: fullName, college: profile.college });
        if (res.success) {
            showStatus('Profile saved successfully!', 'success');
            await updateSession({ name: fullName }); // Update session
        } else {
            showStatus(res.error || 'Failed to save profile.', 'error');
        }
        setSaving(false);
    };

    const handleSavePreferences = async (newPrefs: typeof preferences) => {
        setPreferences(newPrefs);
        const res = await updateUserProfile({ preferences: newPrefs });
        if (!res.success) showStatus('Failed to save preferences.', 'error');
        else showStatus('Preferences saved!', 'success');
    };

    const handleSaveNotifications = async (newNotif: typeof notifications) => {
        setNotifications(newNotif);
        const res = await updateUserProfile({ notifications: newNotif });
        if (!res.success) showStatus('Failed to save notification settings.', 'error');
        else showStatus('Notification settings saved!', 'success');
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.new || passwords.new.length < 6) {
            showStatus('Password must be at least 6 characters.', 'error');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            showStatus('Passwords do not match.', 'error');
            return;
        }
        setSaving(true);
        const res = await updatePassword(passwords.new);
        if (res.success) {
            showStatus('Password updated successfully!', 'success');
            setPasswords({ new: '', confirm: '' });
        } else {
            showStatus(res.error || 'Failed to update password.', 'error');
        }
        setSaving(false);
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Account Profile' },
        { id: 'preferences', icon: Wand2, label: 'Preferences' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'security', icon: Shield, label: 'Security' },
    ];

    const initials = `${profile.firstName[0] || '?'}${profile.lastName[0] || ''}`.toUpperCase();

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your elite productivity workspace.</p>
            </div>

            {/* Status Toast */}
            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={clsx(
                            "fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm border",
                            status.type === 'success'
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        )}
                    >
                        {status.type === 'success'
                            ? <CheckCircle2 className="w-4 h-4" />
                            : <AlertCircle className="w-4 h-4" />
                        }
                        {status.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Tab Navigation */}
                <div className="w-full md:w-56 shrink-0">
                    <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-2 flex flex-row md:flex-col gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left w-full",
                                    activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <tab.icon className="w-5 h-5 shrink-0" />
                                <span className="hidden md:block text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="glass-card border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : activeTab === 'profile' ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Profile Settings</h2>

                                    {/* Avatar */}
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-xl flex-shrink-0">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{profile.firstName} {profile.lastName}</p>
                                            <p className="text-sm text-slate-500">{profile.email}</p>
                                            {profile.college && <p className="text-sm text-blue-500 font-medium mt-0.5">{profile.college}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                                            <input
                                                type="text"
                                                value={profile.firstName}
                                                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                                            <input
                                                type="text"
                                                value={profile.lastName}
                                                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    readOnly
                                                    value={profile.email}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium opacity-70 cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400">Email cannot be changed.</p>
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">College / Course</label>
                                            <div className="relative">
                                                <GraduationCap className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={profile.college}
                                                    onChange={e => setProfile({ ...profile, college: e.target.value })}
                                                    placeholder="e.g., Computer Science, MIT"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>

                            ) : activeTab === 'preferences' ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">App Preferences</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                            <div>
                                                <h4 className="font-bold flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-blue-500" /> Theme Preference</h4>
                                                <p className="text-sm text-slate-500 mt-0.5">Choose how the app looks to you.</p>
                                            </div>
                                            <select
                                                value={preferences.theme}
                                                onChange={(e) => handleSavePreferences({ ...preferences, theme: e.target.value })}
                                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold text-sm appearance-none cursor-pointer"
                                            >
                                                <option>System Default</option>
                                                <option>Light Mode</option>
                                                <option>Dark Mode</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                            <div>
                                                <h4 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-advance Routine</h4>
                                                <p className="text-sm text-slate-500 mt-0.5">Automatically move to the next block when current is 100%.</p>
                                            </div>
                                            <ToggleSwitch
                                                checked={preferences.autoAdvance}
                                                onChange={(v) => handleSavePreferences({ ...preferences, autoAdvance: v })}
                                            />
                                        </div>
                                    </div>
                                </div>

                            ) : activeTab === 'notifications' ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Notification Settings</h2>
                                    <p className="text-slate-500 text-sm">We believe in deep work. We only notify you when it truly matters.</p>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'dailyReminder', title: "Daily Routine Reminder", desc: "Push notification at the start of Morning Block.", checked: notifications.dailyReminder },
                                            { key: 'weeklyReview', title: "Weekly Review Setup", desc: "Email reminder on Sunday evening to plan the week.", checked: notifications.weeklyReview },
                                            { key: 'deepWorkChime', title: "Deep Work Completion", desc: "Sound chime when a Pomodoro session ends.", checked: notifications.deepWorkChime },
                                        ].map((notif) => (
                                            <div key={notif.key} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{notif.title}</h4>
                                                    <p className="text-sm text-slate-500 mt-0.5">{notif.desc}</p>
                                                </div>
                                                <ToggleSwitch
                                                    checked={notif.checked}
                                                    onChange={(v) => handleSaveNotifications({ ...notifications, [notif.key]: v })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            ) : activeTab === 'security' ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Security & Login</h2>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Set a new password below. It must be at least 6 characters long.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPw.new ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={passwords.new}
                                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPw(s => ({ ...s, new: !s.new }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPw.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPw.confirm ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={passwords.confirm}
                                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                                    className={clsx(
                                                        "w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 transition-all font-medium",
                                                        passwords.confirm && passwords.new !== passwords.confirm
                                                            ? "border-red-400 focus:ring-red-500"
                                                            : "border-slate-200 dark:border-slate-800 focus:ring-blue-500"
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPw.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {passwords.confirm && passwords.new !== passwords.confirm && (
                                                <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={saving || !passwords.new || !passwords.confirm}
                                            className="px-8 py-3 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50"
                                        >
                                            {saving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
