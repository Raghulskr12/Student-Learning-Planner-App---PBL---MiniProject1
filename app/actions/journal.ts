'use server';

import connectToDatabase from "@/lib/mongodb";
import { Journal } from "@/lib/models/Journal";
import { AnalyticsActivity } from "@/lib/models/AnalyticsActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function submitJournalEntry(data: {
    ratings: { workout: number; studies: number; diet: number; sleep: number };
    wins: string;
    lessons: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Upsert journal entry for today
        await Journal.findOneAndUpdate(
            { userId: (session.user as any).id, date: today },
            { 
                userId: (session.user as any).id, 
                date: today,
                ratings: data.ratings,
                wins: data.wins,
                lessons: data.lessons
            },
            { upsert: true, new: true }
        );

        // Calculate a Habit Score (0-4) based on ratings for the heatmap
        const totalScore = data.ratings.workout + data.ratings.studies + data.ratings.diet + data.ratings.sleep;
        const habitScoreRatio = totalScore / 40; // Max possible is 40
        let habitScore = 0;
        if (habitScoreRatio > 0.8) habitScore = 4;
        else if (habitScoreRatio > 0.6) habitScore = 3;
        else if (habitScoreRatio > 0.4) habitScore = 2;
        else if (habitScoreRatio > 0.1) habitScore = 1;

        // Upsert Analytics Activity for today
        await AnalyticsActivity.findOneAndUpdate(
            { userId: (session.user as any).id, date: today },
            { 
                userId: (session.user as any).id, 
                date: today,
                habitScore: habitScore
            },
            { upsert: true, new: true }
        );

        return { success: true };
    } catch (e: any) {
        console.error("Error saving journal:", e);
        return { error: "Failed to save journal entry" };
    }
}
