'use server';

import connectToDatabase from "@/lib/mongodb";
import { RoutineTemplate } from "@/lib/models/Routine";
import { DailyLog } from "@/lib/models/DailyLog";
import { AnalyticsActivity } from "@/lib/models/AnalyticsActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getMasterRoutine() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        let routine = await RoutineTemplate.findOne({ userId: (session.user as any).id });
        
        // If they don't have a template yet, create a default "Top 1%" stub
        if (!routine) {
            routine = await RoutineTemplate.create({
                userId: (session.user as any).id,
                name: "Elite Protocol Baseline",
                morning: [
                    { title: "Hydrate & Sunlight", startTime: "06:00", endTime: "06:30", isDeepWork: false, subtasks: [] },
                    { title: "Zone 2 Cardio / Gym", startTime: "06:30", endTime: "07:30", isDeepWork: false, subtasks: [] },
                    { title: "Deep Work Session 1", startTime: "08:00", endTime: "10:00", isDeepWork: true, subtasks: [] }
                ],
                afternoon: [
                    { title: "Deep Work Session 2", startTime: "12:00", endTime: "14:00", isDeepWork: true, subtasks: [] },
                    { title: "Admin / Emails", startTime: "14:00", endTime: "15:00", isDeepWork: false, subtasks: [] }
                ],
                evening: [
                    { title: "Wind down / Read", startTime: "18:00", endTime: "19:00", isDeepWork: false, subtasks: [] }
                ],
                night: [
                    { title: "Plan Tomorrow", startTime: "21:00", endTime: "21:30", isDeepWork: false, subtasks: [] }
                ]
            });
        }
        
        return { success: true, routine: JSON.parse(JSON.stringify(routine)) };
    } catch (e: any) {
        console.error("Error fetching routine:", e);
        return { error: "Failed to load routine" };
    }
}

export async function saveMasterRoutine(routineData: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        const existing = await RoutineTemplate.findOne({ userId: (session.user as any).id });
        if (existing) {
            existing.morning = routineData.Morning || routineData.morning || [];
            existing.afternoon = routineData.Afternoon || routineData.afternoon || [];
            existing.evening = routineData.Evening || routineData.evening || [];
            existing.night = routineData.Night || routineData.night || [];
            await existing.save();
        } else {
            await RoutineTemplate.create({
                userId: (session.user as any).id,
                name: "My Routine",
                morning: routineData.Morning || routineData.morning || [],
                afternoon: routineData.Afternoon || routineData.afternoon || [],
                evening: routineData.Evening || routineData.evening || [],
                night: routineData.Night || routineData.night || [],
            });
        }
        
        return { success: true };
    } catch (e: any) {
        console.error("Error saving routine:", e);
        return { error: "Failed to save routine" };
    }
}

export async function getTodayDailyLog() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find today's log
        let dailyLog = await DailyLog.findOne({
            userId: (session.user as any).id,
            date: { $gte: today, $lt: tomorrow }
        }).lean();

        if (!dailyLog) {
            // Seed from master routine
            const routine = await RoutineTemplate.findOne({ userId: (session.user as any).id }).lean();
            if (routine) {
                const mapTasks = (tasks: any[]) => tasks.map(t => ({
                    title: t.title,
                    startTime: t.startTime || '',
                    endTime: t.endTime || '',
                    isDeepWork: t.isDeepWork || false,
                    checked: false,
                    subtasks: (t.subtasks || []).map((s: any) => ({ title: s.title, checked: false }))
                }));

                const newLog = await DailyLog.create({
                    userId: (session.user as any).id,
                    date: today,
                    morning: mapTasks(routine.morning || []),
                    afternoon: mapTasks(routine.afternoon || []),
                    evening: mapTasks(routine.evening || []),
                    night: mapTasks(routine.night || []),
                });
                dailyLog = await DailyLog.findById(newLog._id).lean();
            }
        }

        return { success: true, dailyLog: dailyLog ? JSON.parse(JSON.stringify(dailyLog)) : null };
    } catch (e: any) {
        console.error("Error fetching daily log:", e);
        return { error: "Failed to load daily log" };
    }
}

export async function saveDailyLog(logData: {
    morning: any[];
    afternoon: any[];
    evening: any[];
    night: any[];
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count total checked tasks across all blocks
        const allTasks = [
            ...logData.morning,
            ...logData.afternoon,
            ...logData.evening,
            ...logData.night
        ];
        const tasksCompleted = allTasks.filter(t => t.checked).length;

        // Upsert daily log
        await DailyLog.findOneAndUpdate(
            { userId: (session.user as any).id, date: { $gte: today, $lt: tomorrow } },
            {
                userId: (session.user as any).id,
                date: today,
                morning: logData.morning,
                afternoon: logData.afternoon,
                evening: logData.evening,
                night: logData.night,
            },
            { upsert: true, new: true }
        );

        // Update analytics – preserve habitScore and deepWorkMinutes
        const existing = await AnalyticsActivity.findOne({
            userId: (session.user as any).id,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existing) {
            existing.tasksCompleted = tasksCompleted;
            await existing.save();
        } else {
            await AnalyticsActivity.create({
                userId: (session.user as any).id,
                date: today,
                tasksCompleted,
                deepWorkMinutes: 0,
                habitScore: 0
            });
        }

        return { success: true };
    } catch (e: any) {
        console.error("Error saving daily log:", e);
        return { error: "Failed to save daily log" };
    }
}
