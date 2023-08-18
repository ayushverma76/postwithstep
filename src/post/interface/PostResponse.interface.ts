import { Posts } from "src/entities/post.schema";

export interface PostInterfaceResponse {
  code: number;
  message: string;
  status: string;
  data: Posts;

}