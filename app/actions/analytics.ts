'use server';

import connectToDatabase from "@/lib/mongodb";
import { AnalyticsActivity } from "@/lib/models/AnalyticsActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAnalyticsData() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        // Fetch last 70 days for heatmap
        const analytics = await AnalyticsActivity.find({ 
            userId: (session.user as any).id 
        })
        .sort({ date: -1 }) // newest first
        .limit(70)
        .lean();

        // Calculate some basic stats
        let totalDeepWorkStr = "0h";
        let habitScoreCalc = "0%";
        let tasksCompletedSum = 0;

        if (analytics.length > 0) {
            const sumDeepWork = analytics.reduce((acc, curr) => acc + (curr.deepWorkMinutes || 0), 0);
            totalDeepWorkStr = `${Math.floor(sumDeepWork / 60)}h`;

            // Avg habit score map max 4 to 100%
            const sumHabits = analytics.reduce((acc, curr) => acc + (curr.habitScore || 0), 0);
            const avgHabit = sumHabits / analytics.length;
            habitScoreCalc = `${Math.round((avgHabit / 4) * 100)}%`;

            tasksCompletedSum = analytics.reduce((acc, curr) => acc + (curr.tasksCompleted || 0), 0);
        }

        return { 
            success: true, 
            data: JSON.parse(JSON.stringify(analytics)),
            stats: {
                totalDeepWork: totalDeepWorkStr,
                habitScore: habitScoreCalc,
                tasksCompleted: tasksCompletedSum.toString()
            }
        };

    } catch (e: any) {
        console.error("Error fetching analytics:", e);
        return { error: "Failed to load analytics" };
    }
}
