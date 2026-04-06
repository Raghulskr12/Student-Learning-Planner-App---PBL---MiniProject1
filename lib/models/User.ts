import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  college?: string;
  preferences: {
    theme: string;
    autoAdvance: boolean;
  };
  notifications: {
    dailyReminder: boolean;
    weeklyReview: boolean;
    deepWorkChime: boolean;
  };
  weeklyPlan: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  college: { type: String, default: '' },
  preferences: {
    theme: { type: String, default: 'System Default' },
    autoAdvance: { type: Boolean, default: true }
  },
  notifications: {
    dailyReminder: { type: Boolean, default: true },
    weeklyReview: { type: Boolean, default: true },
    deepWorkChime: { type: Boolean, default: true }
  },
  weeklyPlan: { type: Object, default: {
      'Monday': 'College Day Template',
      'Tuesday': 'College Day Template',
      'Wednesday': 'Light Day Template',
      'Thursday': 'College Day Template',
      'Friday': 'Project Day',
      'Saturday': 'Weekend Grind',
      'Sunday': 'Rest & Reset'
  } }
}, { timestamps: true });

// Prevent mongoose from recompiling the model upon hot recovery in Next.js
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
