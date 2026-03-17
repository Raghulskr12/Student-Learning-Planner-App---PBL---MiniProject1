'use server';

import connectToDatabase from "@/lib/mongodb";
import { RoutineTemplate } from "@/lib/models/Routine";
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
                    { title: "Hydrate & Sunlight", isDeepWork: false, subtasks: [] },
                    { title: "Zone 2 Cardio / Gym", isDeepWork: false, subtasks: [] },
                    { title: "Deep Work Session 1", isDeepWork: true, subtasks: [] }
                ],
                afternoon: [
                    { title: "Deep Work Session 2", isDeepWork: true, subtasks: [] },
                    { title: "Admin / Emails", isDeepWork: false, subtasks: [] }
                ],
                evening: [
                    { title: "Wind down / Read", isDeepWork: false, subtasks: [] }
                ],
                night: [
                    { title: "Plan Tomorrow", isDeepWork: false, subtasks: [] }
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
            existing.morning = routineData.Morning || routineData.morning;
            existing.afternoon = routineData.Afternoon || routineData.afternoon;
            existing.evening = routineData.Evening || routineData.evening;
            existing.night = routineData.Night || routineData.night;
            await existing.save();
        }
        
        return { success: true };
    } catch (e: any) {
        console.error("Error saving routine:", e);
        return { error: "Failed to save routine" };
    }
}
