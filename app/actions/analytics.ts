'use server';

import connectToDatabase from "@/lib/mongodb";
import { AnalyticsActivity } from "@/lib/models/AnalyticsActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function logDeepWorkSession(minutes: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existing = await AnalyticsActivity.findOne({
            userId: (session.user as any).id,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existing) {
            existing.deepWorkMinutes = (existing.deepWorkMinutes || 0) + minutes;
            await existing.save();
        } else {
            await AnalyticsActivity.create({
                userId: (session.user as any).id,
                date: today,
                deepWorkMinutes: minutes,
                tasksCompleted: 0,
                habitScore: 0
            });
        }

        return { success: true };
    } catch (e: any) {
        console.error("Error logging deep work:", e);
        return { error: "Failed to log deep work session" };
    }
}

export async function getAnalyticsData() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        // Fetch last 70 days for heatmap (newest first)
        const analytics = await AnalyticsActivity.find({ 
            userId: (session.user as any).id 
        })
        .sort({ date: -1 })
        .limit(70)
        .lean();

        // Calculate streak: consecutive days from today backwards
        let streak = 0;
        const sortedByDate = [...analytics].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedByDate.length; i++) {
            const entryDate = new Date(sortedByDate[i].date);
            entryDate.setHours(0, 0, 0, 0);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (entryDate.getTime() === expectedDate.getTime() && (sortedByDate[i].habitScore || 0) > 0) {
                streak++;
            } else {
                break;
            }
        }

        // Calculate stats
        let totalDeepWorkStr = "0h";
        let habitScoreCalc = "0%";
        let tasksCompletedSum = 0;

        if (analytics.length > 0) {
            const sumDeepWork = analytics.reduce((acc, curr) => acc + (curr.deepWorkMinutes || 0), 0);
            const hours = Math.floor(sumDeepWork / 60);
            const mins = sumDeepWork % 60;
            totalDeepWorkStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

            // Avg habit score (max 4 = 100%)
            const sumHabits = analytics.reduce((acc, curr) => acc + (curr.habitScore || 0), 0);
            const avgHabit = sumHabits / analytics.length;
            habitScoreCalc = `${Math.round((avgHabit / 4) * 100)}%`;

            tasksCompletedSum = analytics.reduce((acc, curr) => acc + (curr.tasksCompleted || 0), 0);
        }

        // Weekly deep work for bar chart (last 7 days)
        const weeklyData: { day: string; minutes: number }[] = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            const dayStr = dayNames[d.getDay()];
            const found = analytics.find(a => {
                const aDate = new Date(a.date);
                aDate.setHours(0, 0, 0, 0);
                return aDate.getTime() === d.getTime();
            });
            weeklyData.push({ day: dayStr, minutes: found?.deepWorkMinutes || 0 });
        }

        return { 
            success: true, 
            data: JSON.parse(JSON.stringify(analytics)),
            stats: {
                totalDeepWork: totalDeepWorkStr,
                habitScore: habitScoreCalc,
                tasksCompleted: tasksCompletedSum.toString(),
                streak: streak > 0 ? `${streak} Day${streak > 1 ? 's' : ''}` : '0 Days'
            },
            weeklyData
        };

    } catch (e: any) {
        console.error("Error fetching analytics:", e);
        return { error: "Failed to load analytics" };
    }
}
