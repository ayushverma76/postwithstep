import mongoose from 'mongoose';
import { Schema, Document, model } from 'mongoose';

export interface Step extends Document {
    title: string
    description: string;

}

export const StepSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});


export const Group = mongoose.model<Step>('Step', StepSchema);