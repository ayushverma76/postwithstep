import mongoose, { Schema, Document } from 'mongoose';
export interface Posts extends Document {

  title: string,
  description: string,
  tag: string[],
  //steps: mongoose.Types.ObjectId[];
  steps: {
    title: string;
    description: string;
  }[];

} 


export const PostsSchema: Schema = new Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', },
  tag: [{ type: String, required: true }],
  group: {type: String},
  steps: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },]
});


export const Posts = mongoose.model<Posts>('Post', PostsSchema);


