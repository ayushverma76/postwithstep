import mongoose from 'mongoose';
import { Schema, Document, model } from 'mongoose';

export interface Group extends Document {
    title: string

}

export const GroupSchema: Schema = new Schema({
    title: { type: String, required: true },
});


export const Group = mongoose.model<Group>('Group', GroupSchema);