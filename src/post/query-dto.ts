import { IsIn, IsDate, IsString, IsNumber, IsOptional } from "class-validator";

export class GetQueryDto {

    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    group?: string;

    @IsString()
    @IsOptional()
    tag?: string;

    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsNumber()
    @IsOptional()
    pageNumber: number;

    @IsNumber()
    @IsOptional()
    pageSize: number;


    @IsString()
    @IsOptional()
    @IsIn(['title', 'description', 'tag', 'group'])
    sortField?: string;

    @IsString()
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: string;


}