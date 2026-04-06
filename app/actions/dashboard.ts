'use server';

import connectToDatabase from "@/lib/mongodb";
import { RoutineTemplate } from "@/lib/models/Routine";
import { DailyLog } from "@/lib/models/DailyLog";
import { AnalyticsActivity } from "@/lib/models/AnalyticsActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getDashboardData() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };
        const userId = (session.user as any).id;

        await connectToDatabase();

        // Get today's daily log (user's actual task state for today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dailyLog = await DailyLog.findOne({
            userId,
            date: { $gte: today, $lt: tomorrow }
        }).lean();

        let blocks: any[] = [];
        
        if (dailyLog) {
            blocks = [
                ...(dailyLog.morning || []),
                ...(dailyLog.afternoon || []),
                ...(dailyLog.evening || []),
                ...(dailyLog.night || []),
            ];
        } else {
            // Fall back to routine template if no daily log
            const routine = await RoutineTemplate.findOne({ userId }).lean();
            if (routine) {
                blocks = [
                    ...(routine.morning || []),
                    ...(routine.afternoon || []),
                    ...(routine.evening || []),
                    ...(routine.night || []),
                ];
            }
        }

        // Today's analytics
        const activity = await AnalyticsActivity.findOne({
            userId,
            date: { $gte: today, $lt: tomorrow }
        }).lean();

        // Real task counts
        const totalChecked = dailyLog
            ? blocks.filter((b: any) => b.checked).length
            : (activity?.tasksCompleted || 0);
        const totalBlocks = blocks.length;
        const todayProgress = totalBlocks === 0
            ? 0
            : Math.round((totalChecked / totalBlocks) * 100);

        // Find active and upcoming blocks (by time)
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMins = now.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${currentHours}:${currentMins}`;

        let activeBlock: any = null;
        let upcomingBlocks: any[] = [];

        // Only consider blocks with time set
        const timedBlocks = blocks.filter((b: any) => b.startTime && b.endTime);
        
        for (let i = 0; i < timedBlocks.length; i++) {
            const b = timedBlocks[i] as any;
            if (currentTimeString >= b.startTime && currentTimeString <= b.endTime) {
                activeBlock = b;
                upcomingBlocks = timedBlocks.slice(i + 1, i + 4);
                break;
            } else if (currentTimeString < b.startTime && !activeBlock) {
                upcomingBlocks = timedBlocks.slice(i, i + 3);
                break;
            }
        }
        
        if (!activeBlock && upcomingBlocks.length === 0 && timedBlocks.length > 0) {
            upcomingBlocks = timedBlocks.slice(0, 3);
        }

        // If no timed blocks, show unfinished blocks
        if (upcomingBlocks.length === 0) {
            upcomingBlocks = blocks.filter((b: any) => !b.checked).slice(0, 3);
        }

        let deepWorkToday = 0;
        if (activity?.deepWorkMinutes) {
            deepWorkToday = parseFloat((activity.deepWorkMinutes / 60).toFixed(1));
        }

        // Real streak: consecutive days with activity
        const allActivity = await AnalyticsActivity.find({ userId })
            .sort({ date: -1 })
            .limit(60)
            .lean();

        let streak = 0;
        for (let i = 0; i < allActivity.length; i++) {
            const entryDate = new Date(allActivity[i].date);
            entryDate.setHours(0, 0, 0, 0);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (entryDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return {
            success: true,
            data: {
                todayProgress,
                totalChecked,
                totalBlocks,
                activeBlock,
                upcomingBlocks,
                deepWorkToday,
                streak
            }
        };
    } catch (e: any) {
        return { error: e.message };
    }
}
