import { Step } from "src/entities/step.schema";

export interface StepInterfaceResponse {
  code: number;
  message: string;
  status: string;
  data: Step;

} 