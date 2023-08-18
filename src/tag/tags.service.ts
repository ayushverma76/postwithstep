import { GetQueryDto } from 'src/post/query-dto';
import { SortOrder } from 'mongoose';
import { Tag } from 'src/entities/tag.schema';
import { PostInterfaceResponse } from 'src/post/interface/PostResponse.interface';
import { TagInterfaceResponse } from './interface/TagResponse.interface';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/entities/group.schema';

import { CreateTagDto } from './createTag-dto';
import { Controller } from '@nestjs/common';


@Injectable()
export class TagService {
    constructor(@InjectModel('Tag') private readonly tagModel: Model<Tag>) { }


    async create(createTagDto: CreateTagDto): Promise<TagInterfaceResponse | null> {
        // Check if a customer with the same email or mobile number already exists
        const existingTag = await this.tagModel.findOne({

            title: createTagDto.title

        });

        if (existingTag) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Tag already exists');
        }

        // No existing customer found, create a new one
        const createdTag = await this.tagModel.create(createTagDto);
        await createdTag.save();
        return {
            code: 200,
            message: 'Tag created successfully',
            status: 'success',
            data: createdTag,
        };
    }



    async getAllTags(): Promise<any> {
        return this.tagModel.find();
    }


    async getTagById(id: string): Promise<TagInterfaceResponse> {
        try {
            const FoundTag = await this.tagModel.findById(id).exec();

            if (!FoundTag) {
                throw new NotFoundException('Unable to find tag');
            }
            else {

                return {
                    code: 200,
                    message: 'Tag found successfully',
                    status: 'success',
                    data: FoundTag,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Tag ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async getFilteredTags(queryDto: GetQueryDto): Promise<any> {
        const { search, limit, pageNumber, pageSize, sortField, sortOrder } = queryDto;
        const query = this.tagModel.find();


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
        const totalRecords = await this.tagModel.find(query.getFilter()).countDocuments();

        return { data, totalRecords };
    }



    async updateGroup(id: string, updateTagDto: CreateTagDto): Promise<TagInterfaceResponse> {
        try {
            const updatedTag = await this.tagModel.findByIdAndUpdate(id, updateTagDto, { new: true }).exec();

            if (!updatedTag) {
                throw new NotFoundException('Unable to update tag ');
            }
            else {

                return {
                    code: 200,
                    message: 'Tag updated successfully',
                    status: 'success',
                    data: updatedTag,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Tag ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async deleteTag(id: string): Promise<TagInterfaceResponse
    > {
        try {
            const deletedTag = await this.tagModel.findByIdAndDelete(id).exec();

            if (!deletedTag) {
                throw new NotFoundException('Unable to delete Tag');
            }
            else {

                return {
                    code: 200,
                    message: 'Tag deleted successfully',
                    status: 'success',
                    data: deletedTag,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Tag ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }

}
