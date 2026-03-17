import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  ratings: {
    workout: number;
    studies: number;
    diet: number;
    sleep: number;
  };
  wins: string;
  lessons: string;
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema: Schema<IJournal> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  ratings: {
    workout: { type: Number, default: 0, min: 0, max: 10 },
    studies: { type: Number, default: 0, min: 0, max: 10 },
    diet: { type: Number, default: 0, min: 0, max: 10 },
    sleep: { type: Number, default: 0, min: 0, max: 10 },
  },
  wins: { type: String, default: '' },
  lessons: { type: String, default: '' }
}, { timestamps: true });

export const Journal: Model<IJournal> = mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema);
