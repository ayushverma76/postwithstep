import mongoose from 'mongoose';
import { Schema, Document, model } from 'mongoose';

export interface Tag extends Document {
    title: string;

}

export const TagSchema: Schema = new Schema({
    title: { type: String, required: true },

});


export const Otp = mongoose.model<Tag>('Tag', TagSchema);