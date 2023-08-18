import { Posts } from "src/entities/post.schema";
import { Step } from "src/entities/step.schema"; // Import the Step interface

export interface PostWithStepsResponse {
  code: number;
  message: string;
  status: string;
  data: {
    post: Posts;
    steps: Step[];
  };
}
