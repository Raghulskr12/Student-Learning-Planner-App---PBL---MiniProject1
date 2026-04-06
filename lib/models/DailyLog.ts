import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailySubtask {
  title: string;
  checked: boolean;
}

export interface IDailyRoutineTask {
  title: string;
  startTime?: string;
  endTime?: string;
  isDeepWork: boolean;
  checked: boolean;
  subtasks: IDailySubtask[];
}

export interface IDailyLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date; // Set to midnight of the specific day
  morning: IDailyRoutineTask[];
  afternoon: IDailyRoutineTask[];
  evening: IDailyRoutineTask[];
  night: IDailyRoutineTask[];
  createdAt: Date;
  updatedAt: Date;
}

const DailySubtaskSchema = new Schema<IDailySubtask>({
  title: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const DailyRoutineTaskSchema = new Schema<IDailyRoutineTask>({
  title: { type: String, required: true },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  isDeepWork: { type: Boolean, default: false },
  checked: { type: Boolean, default: false },
  subtasks: [DailySubtaskSchema],
});

// A localized copy of the template applied to a specific day to track state
const DailyLogSchema: Schema<IDailyLog> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  morning: [DailyRoutineTaskSchema],
  afternoon: [DailyRoutineTaskSchema],
  evening: [DailyRoutineTaskSchema],
  night: [DailyRoutineTaskSchema],
}, { timestamps: true });

export const DailyLog: Model<IDailyLog> = mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
