import { ValidateNested } from 'class-validator';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ObjectIdSchemaDefinition } from 'mongoose';

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    groupId: ObjectId;

    @IsString({ each: true }) // Validate each element as a string
    @IsOptional()
    tag: string[];


    @IsOptional()
    @ValidateNested({ each: true })
    steps: {
        title: string;
        description: string;
    }[];
}





