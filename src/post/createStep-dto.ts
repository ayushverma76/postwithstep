import { IsNotEmpty, IsString } from "class-validator";

export class CreateStepDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;


}
