import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsActivity extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  deepWorkMinutes: number;
  tasksCompleted: number;
  habitScore: number; // calculated 0-4 daily status for the heatmap
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsActivitySchema: Schema<IAnalyticsActivity> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  deepWorkMinutes: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  habitScore: { type: Number, default: 0, min: 0, max: 4 }
}, { timestamps: true });

export const AnalyticsActivity: Model<IAnalyticsActivity> = mongoose.models.AnalyticsActivity || mongoose.model<IAnalyticsActivity>('AnalyticsActivity', AnalyticsActivitySchema);
