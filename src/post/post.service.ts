import { PostWithStepsResponse } from './interface/PostwithStepResponce.interface';
import { BadRequestException, ConflictException } from '@nestjs/common/exceptions';
import { StepInterfaceResponse } from './interface/StepResponse.interface';
import { CreateStepDto } from './createStep-dto';
import { Step } from 'src/entities/step.schema';
import { Tag } from 'src/entities/tag.schema';
import { GetQueryDto } from './query-dto';
import { Group } from 'src/entities/group.schema';
import { PostInterfaceResponse } from './interface/PostResponse.interface';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Posts } from 'src/entities/post.schema';
import { CreatePostDto } from './createPost-dto';
import { title } from 'process';


@Injectable()
export class PostsService {
    constructor(@InjectModel('Posts') private readonly postsModel: Model<Posts>,
        @InjectModel('Group') private readonly groupModel: Model<Group>,
        @InjectModel('Tag') private readonly tagModel: Model<Tag>) { }
    @InjectModel('Step') private readonly stepModel: Model<Step>



    async createPost(createPostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        const { groupId, ...postData } = createPostDto;
        const group = await this.groupModel.findById(groupId);
        const Tag = await this.tagModel.findOne({ title });
        if (!group) {
            throw new NotFoundException('Invalid groupId');
        }
        /*if(!Tag)
         {
             throw new NotFoundException('Title does not exist')
         }  */
        const newPostData = {
            ...postData,
            //groupId: group._id,
            group: group.title,
            //tag: tag.title,

            // category: category.title,
        };

        const existingPost = await this.postsModel.findOne({

            title: createPostDto.title

        });


        if (existingPost) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Post already exists');
        }

        // No existing customer found, create a new one
        const createdPost = await this.postsModel.create(newPostData);
        await createdPost.save();
        return {
            code: 200,
            message: 'Post created successfully',
            status: 'success',
            data: createdPost,
        };
    }



    /*
    
    async createPost(createPostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        const { groupId, steps, ...postData } = createPostDto; // Extract steps from createPostDto
        const group = await this.groupModel.findById(groupId);
        const Tag = await this.tagModel.findOne({ title });
        
        if (!group) {
            throw new NotFoundException('Invalid groupId');
        }
        
        const newPostData = {
            ...postData,
            group: group.title,
        };
        
        const existingPost = await this.postsModel.findOne({
            title: createPostDto.title
        });
        
        if (existingPost) {
            throw new NotFoundException('Post already exists');
        }
        
        // Create the post and associate steps
        const createdPost = await this.postsModel.create(newPostData);
        createdPost.steps = steps; // Assign the steps array to the post's steps property
        await createdPost.save();
        
        return {
            code: 200,
            message: 'Post created successfully',
            status: 'success',
            data: createdPost,
        };
    }
    */
    /*
  
      async createPostWithSteps(createPostDto: CreatePostDto): Promise<PostWithStepsResponse> {
          const { steps, ...postData } = createPostDto;
  
          // Fetch the group
          const group = await this.groupModel.findById(postData.groupId);
          if (!group) {
              throw new NotFoundException('Invalid groupId');
          }
  
          // Check if the post already exists
          const existingPost = await this.postsModel.findOne({ title: postData.title });
          if (existingPost) {
              throw new NotFoundException('Post already exists');
          }
  
          let createdSteps = [];
  
          if (steps && steps.length > 0) {
              // Create steps and get their IDs, titles, and descriptions
              createdSteps = await this.stepModel.create(steps);
          }
  
          // Create a new post and associate created step IDs, titles, and descriptions
          const createdPost = await this.postsModel.create({
              ...postData,
              steps: createdSteps.map(step => ({
                  _id: step._id,
                  title: step.title,
                  description: step.description,
              })), // Map each step's properties
              // Use the 'tags' array directly
              group: group.title,
          });
  
          // Populate step fields and return the created post
          const populatedSteps = await this.stepModel.find({ _id: { $in: createdSteps.map(step => step._id) } });
  
          return {
              code: 200,
              message: 'Post with steps and tags created successfully',
              status: 'success',
              data: {
                  ...createdPost.toObject(),
                  steps: populatedSteps,
              },
          };
      }
  
      */


    /*
        async createPostWithSteps(createPostDto: CreatePostDto): Promise<PostInterfaceResponse> {
            try {
              // Create a new post with the provided steps
              const createdPost = await this.postsModel.create(createPostDto);
          
              return {
                code: 200,
                message: 'Post with steps and tags created successfully',
                status: 'success',
                data: createdPost,
              };
            } catch (error) {
              // Handle errors
              // ...
            }
          }
    */


    async getAllPosts(): Promise<any> {
        return this.postsModel.find();
    }


    async getFilteredPosts(queryDto: GetQueryDto): Promise<any> {
        const { search, group, tag, limit, pageNumber, pageSize, sortField, sortOrder } = queryDto;
        const query = this.postsModel.find();


        if (search) {
            query.or([
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tag: { $regex: search, $options: 'i' } },
                { group: { $regex: search, $options: 'i' } },

            ]);
        }

        if (tag && Array.isArray(tag) && tag.length > 0) {
            query.or([{ tag: { $in: tag.map(tag => new RegExp(tag, 'i')) } }]);
        }

        if (group && Array.isArray(group) && group.length > 0) {
            query.or([{ group: { $in: group.map(grp => new RegExp(grp, 'i')) } }]);
        }

        if (pageNumber && pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            query.skip(skip).limit(pageSize);
        }

        if (sortField && sortOrder) {
            const sortOptions: [string, SortOrder][] = [[sortField, sortOrder as SortOrder]];
            query.sort(sortOptions);
        }

        /*query.populate({
            path: 'steps',
            select: 'title description _id', // Select the fields you want to populate
        });
        */

        const data = await query.exec();
        const totalRecords = await this.postsModel.find(query.getFilter()).countDocuments();

        return { data, totalRecords };
    }

    /*
        async getPostById(id: string): Promise<PostInterfaceResponse> {
            try {
                const FoundPost = await this.postsModel.findById(id).exec();
    
                if (!FoundPost) {
                    throw new NotFoundException('Unable to find post');
                }
                else {
    
                    return {
                        code: 200,
                        message: 'Post found successfully',
                        status: 'success',
                        data: FoundPost,
                    };
                }
            }
            catch (error) {
                // Handle the specific CastError here
                if (error) {
                    throw new NotFoundException('Invalid Post ID');
                }
    
                // Handle other potential errors or rethrow them
                throw error;
            }
        }
        
        */

    async getPostById(id: string): Promise<PostInterfaceResponse> {
        try {
            const FoundPost = await this.postsModel.findById(id)
                .populate({
                    path: 'steps',
                    select: 'title description _id', // Select the fields you want to populate
                })
                .exec();

            if (!FoundPost) {
                throw new NotFoundException('Unable to find post');
            } else {
                return {
                    code: 200,
                    message: 'Post found successfully',
                    status: 'success',
                    data: FoundPost,
                };
            }
        } catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    /*   
    async updatePost(id: string, updatePostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        try {
            const updatedPost = await this.postsModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
            console.log(updatedPost)          
            if (!updatedPost) {
                throw new NotFoundException('Unable to update Post');
            }
            else {

                return {
                    code: 200,
                    message: 'Post updated successfully',
                    status: 'success',
                    data: updatedPost,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }
      */


    async updatePost(id: string, updatePostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        try {
            // Find the existing post
            const existingPost = await this.postsModel.findById(id);

            if (!existingPost) {
                throw new NotFoundException('Post not found');
            }

            // Update the post's properties
            existingPost.title = updatePostDto.title;
            existingPost.description = updatePostDto.description;
            existingPost.tag = updatePostDto.tag;
            // ...update other properties if needed

            // Fetch existing steps associated with the post
            const existingSteps = await this.stepModel.find({ _id: { $in: existingPost.steps } });

            // Update steps if they are included in updatePostDto
            if (updatePostDto.steps) {
                // Iterate over the steps in updatePostDto
                for (const stepId of updatePostDto.steps) {
                    // Find the corresponding existing step document
                    const existingStep = existingSteps.find(step => step._id.toString() === stepId.toString());

                    if (existingStep) {
                        // Update the step's properties if needed
                        // You can update title and description as needed
                        // existingStep.title = updatedTitle;
                        // existingStep.description = updatedDescription;
                        await existingStep.save();
                    }
                }
            }

            // Save the updated post
            const updatedPost = await existingPost.save();

            return {
                code: 200,
                message: 'Post updated successfully',
                status: 'success',
                data: updatedPost,
            };
        } catch (error) {
            // Handle CastError (invalid ID format) and other potential errors
            if (error) {
                throw new BadRequestException('Invalid Post ID');
            }

            // Handle other potential errors
            throw new InternalServerErrorException('An error occurred while updating the post.');
        }
    }





    async deletePost(id: string): Promise<PostInterfaceResponse
    > {
        try {
            const deletedPost = await this.postsModel.findByIdAndDelete(id).exec();

            if (!deletedPost) {
                throw new NotFoundException('Unable to delete Post');
            }
            else {

                return {
                    code: 200,
                    message: 'Post deleted successfully',
                    status: 'success',
                    data: deletedPost,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    //==========================================Step Api===================================================



    async createStep(createStepDto: CreateStepDto): Promise<StepInterfaceResponse | null> {
        // Check if a customer with the same email or mobile number already exists
        const existingStep = await this.stepModel.findOne({

            title: createStepDto.title

        });

        if (existingStep) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Step already exists');
        }

        // No existing customer found, create a new one
        const createdStep = await this.stepModel.create(createStepDto);
        await createdStep.save();
        return {
            code: 200,
            message: 'Step created successfully',
            status: 'success',
            data: createdStep,
        }
    }


    async createSteps(steps: Step[]): Promise<Step[]> {
        if (!steps || steps.length === 0) {
            throw new BadRequestException('No steps provided');
        }

        const existingSteps = await this.findStepsByTitles(steps.map((step) => step.title));

        if (existingSteps.length > 0) {
            throw new ConflictException('Some steps already exist');
        }

        return this.stepModel.create(steps);
    }

    async findStepsByTitles(titles: string[]): Promise<Step[]> {
        return this.stepModel.find({ title: { $in: titles } }).exec();
    }


    async getAllSteps(): Promise<any> {
        return this.stepModel.find();
    }



    async getStepById(id: string): Promise<StepInterfaceResponse> {
        try {
            const FoundStep = await this.stepModel.findById(id).exec();

            if (!FoundStep) {
                throw new NotFoundException('Unable to find step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step found successfully',
                    status: 'success',
                    data: FoundStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    async updateStep(id: string, updateStepDto: CreateStepDto): Promise<StepInterfaceResponse> {
        try {
            const updatedStep = await this.stepModel.findByIdAndUpdate(id, updateStepDto, { new: true }).exec();

            if (!updatedStep) {
                throw new NotFoundException('Unable to update Step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step updated successfully',
                    status: 'success',
                    data: updatedStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async deleteStep(id: string): Promise<StepInterfaceResponse
    > {
        try {
            const deletedStep = await this.stepModel.findByIdAndDelete(id).exec();

            if (!deletedStep) {
                throw new NotFoundException('Unable to delete Step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step deleted successfully',
                    status: 'success',
                    data: deletedStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }

    //============================================Confirm===============================================



    async deleteStepsFromPost(postId: string, stepIds: string[]): Promise<PostInterfaceResponse> {
        // Find the post

        const post = await this.postsModel.findById(postId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Remove the specified step IDs from the post's steps array
        // post.steps = post.steps.filter(stepId => !stepIds.includes(stepId.toHexString()));

        // Save the modified post
        await post.save();

        return {
            code: 200,
            message: 'Steps deleted from post successfully',
            status: 'success',
            data: post,
        };
    }


}







