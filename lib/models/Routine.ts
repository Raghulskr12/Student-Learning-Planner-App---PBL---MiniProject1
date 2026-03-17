import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubtask {
  title: string;
}

export interface IRoutineTask {
  title: string;
  isDeepWork: boolean;
  subtasks: ISubtask[];
}

export interface IRoutineTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  morning: IRoutineTask[];
  afternoon: IRoutineTask[];
  evening: IRoutineTask[];
  night: IRoutineTask[];
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>({
  title: { type: String, required: true },
});

const RoutineTaskSchema = new Schema<IRoutineTask>({
  title: { type: String, required: true },
  isDeepWork: { type: Boolean, default: false },
  subtasks: [SubtaskSchema],
});

const RoutineTemplateSchema: Schema<IRoutineTemplate> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  morning: [RoutineTaskSchema],
  afternoon: [RoutineTaskSchema],
  evening: [RoutineTaskSchema],
  night: [RoutineTaskSchema],
}, { timestamps: true });

export const RoutineTemplate: Model<IRoutineTemplate> = mongoose.models.RoutineTemplate || mongoose.model<IRoutineTemplate>('RoutineTemplate', RoutineTemplateSchema);
