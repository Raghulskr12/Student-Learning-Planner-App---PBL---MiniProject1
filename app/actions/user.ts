'use server';

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function getUserProfile() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        const user = await User.findById((session.user as any).id).select('-password').lean();
        if (!user) return { error: "User not found" };

        return { success: true, data: JSON.parse(JSON.stringify(user)) };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateUserProfile(updateData: {
    name?: string;
    college?: string;
    preferences?: { theme: string; autoAdvance: boolean };
    notifications?: { dailyReminder: boolean; weeklyReview: boolean; deepWorkChime: boolean };
    weeklyPlan?: Record<string, string>;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        await connectToDatabase();
        
        const update: any = {};
        if (updateData.name !== undefined) update.name = updateData.name;
        if (updateData.college !== undefined) update.college = updateData.college;
        if (updateData.preferences !== undefined) update.preferences = updateData.preferences;
        if (updateData.notifications !== undefined) update.notifications = updateData.notifications;
        if (updateData.weeklyPlan !== undefined) update.weeklyPlan = updateData.weeklyPlan;

        await User.findByIdAndUpdate((session.user as any).id, { $set: update });

        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updatePassword(newPassword: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return { error: "Unauthorized" };

        if (!newPassword || newPassword.length < 6) {
            return { error: "Password must be at least 6 characters." };
        }

        await connectToDatabase();

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate((session.user as any).id, { password: hashedPassword });

        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
