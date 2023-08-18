import { Tag } from "src/entities/tag.schema";

export interface TagInterfaceResponse {
  code: number;
  message: string;
  status: string;
  data: Tag;

} 