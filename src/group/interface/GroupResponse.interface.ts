import { Group } from "src/entities/group.schema";

export interface GroupInterfaceResponse {
  code: number;
  message: string;
  status: string;
  data: Group;

} 