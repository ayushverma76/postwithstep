import { InternalServerErrorException, ConflictException } from '@nestjs/common/exceptions';
import { Step } from 'src/entities/step.schema';
import { CreateStepDto } from './createStep-dto';
import { StepInterfaceResponse } from './interface/StepResponse.interface';
import { ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { CreatePostDto } from './createPost-dto';
import { Posts } from 'src/entities/post.schema';
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostInterfaceResponse } from './interface/PostResponse.interface';
import { GetQueryDto } from './query-dto';
import { PostWithStepsResponse } from './interface/PostwithStepResponce.interface';

           
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }


    @Get('getall')
    async getPosts(@Query() queryDto: GetQueryDto): Promise<any> {
        return this.postsService.getFilteredPosts(queryDto);
    }


    @Get('getbyid/:id')
    async getPostById(@Param('id') id: string): Promise<PostInterfaceResponse | null> {
        return this.postsService.getPostById(id);
    }


    @UsePipes(new ValidationPipe())
    @Post('create')
    async createPost(@Body() createPostDto: CreatePostDto): Promise<PostInterfaceResponse | null> {
        return this.postsService.createPost(createPostDto);
    }

    @UsePipes(new ValidationPipe())
    @Put('updatebyid/:id')
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: CreatePostDto,
    ): Promise<PostInterfaceResponse | null> {
        return this.postsService.updatePost(id, updatePostDto)
    }


    @Delete('deletebyid/:id')
    async deletePost(@Param('id') id: string): Promise<PostInterfaceResponse | null> {
        return this.postsService.deletePost(id);
    }

    //=====================================Step Controller===================================================


    @Get('steps/getall')
    async getSteps(): Promise<any> {
        return this.postsService.getAllSteps();
    }

    
    @Get('steps/getbyid/:id')
    async getStepById(@Param('id') id: string): Promise<StepInterfaceResponse | null> {
        return this.postsService.getStepById(id);
    }


    @Post('steps/createMany')
    async createSteps(@Body() steps: Step[]): Promise<{ message: string; createdSteps: Step[] }> {
        try {
            const createdSteps = await this.postsService.createSteps(steps);
            return { message: 'Steps created successfully', createdSteps };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException('An error occurred while creating steps');
            }
        }
    }

    

    @Post('steps/create')
    async createStep(@Body() createStepDto: CreateStepDto): Promise<StepInterfaceResponse | null> {
        return this.postsService.createStep(createStepDto);
    }


    @UsePipes(new ValidationPipe())
    @Put('steps/updatebyid/:id')
    async updateStep(
        @Param('id') id: string,
        @Body() updateStepDto: CreateStepDto,
    ): Promise<StepInterfaceResponse | null> {
        return this.postsService.updateStep(id, updateStepDto)
    }


    @Delete('steps/deletebyid/:id')
    async deleteStep(@Param('id') id: string): Promise<StepInterfaceResponse | null> {
        return this.postsService.deleteStep(id);
    }

    //=============================================Confirm================================================

    @Delete(':postId/delete-steps')
    async deleteStepsFromPost(
        @Param('postId') postId: string,
        @Body() stepIds: string[], // Array of step IDs to delete
    ): Promise<PostInterfaceResponse> {
        return this.postsService.deleteStepsFromPost(postId, stepIds);
    }

}