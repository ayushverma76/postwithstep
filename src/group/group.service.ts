import { SortOrder } from 'mongoose';
import { GetQueryDto } from 'src/post/query-dto';
import { PostInterfaceResponse } from 'src/post/interface/PostResponse.interface';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/entities/group.schema';
import { GroupInterfaceResponse } from './interface/GroupResponse.interface';
import { CreateGroupDto } from './createGroup-dto';
import { Controller } from '@nestjs/common';


@Injectable()
export class GroupService {
    constructor(@InjectModel('Group') private readonly groupModel: Model<Group>) { }


    async create(createGroupDto: CreateGroupDto): Promise<GroupInterfaceResponse | null> {
        // Check if a customer with the same email or mobile number already exists
        const existingGroup = await this.groupModel.findOne({

            title: createGroupDto.title

        });

        if (existingGroup) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Group already exists');
        }

        // No existing customer found, create a new one
        const createdGroup = await this.groupModel.create(createGroupDto);
        await createdGroup.save();
        return {
            code: 200,
            message: 'Group created successfully',
            status: 'success',
            data: createdGroup,
        }
    }

    async getAllGroups(): Promise<any> {
        return this.groupModel.find();
    }



    async getFilteredPosts(queryDto: GetQueryDto): Promise<any> {
        const { search, limit, pageNumber, pageSize, sortField, sortOrder } = queryDto;
        const query = this.groupModel.find();


        if (search) {
            query.or([
                { title: { $regex: search, $options: 'i' } },
            ]);
        }

        if (pageNumber && pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            query.skip(skip).limit(pageSize);
        }

        if (sortField && sortOrder) {
            const sortOptions: [string, SortOrder][] = [[sortField, sortOrder as SortOrder]];
            query.sort(sortOptions);
        }

        const data = await query.exec();
        const totalRecords = await this.groupModel.find(query.getFilter()).countDocuments();

        return { data, totalRecords };
    }


    async getGroupById(id: string): Promise<GroupInterfaceResponse> {
        try {
            const FoundGroup = await this.groupModel.findById(id).exec();

            if (!FoundGroup) {
                throw new NotFoundException('Unable to find group');
            }
            else {

                return {
                    code: 200,
                    message: 'Group found successfully',
                    status: 'success',
                    data: FoundGroup,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Group ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    async updateGroup(id: string, updateGroupDto: CreateGroupDto): Promise<GroupInterfaceResponse> {
        try {
            const updatedGroup = await this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();

            if (!updatedGroup) {
                throw new NotFoundException('Unable to update Post');
            }
            else {

                return {
                    code: 200,
                    message: 'Group updated successfully',
                    status: 'success',
                    data: updatedGroup,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Group ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async deleteGroup(id: string): Promise<GroupInterfaceResponse
    > {
        try {
            const deletedGroup = await this.groupModel.findByIdAndDelete(id).exec();

            if (!deletedGroup) {
                throw new NotFoundException('Unable to delete Group');
            }
            else {

                return {
                    code: 200,
                    message: 'Group deleted successfully',
                    status: 'success',
                    data: deletedGroup,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Group ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }
}


