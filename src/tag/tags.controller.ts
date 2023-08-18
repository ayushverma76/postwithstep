import { GetQueryDto } from 'src/post/query-dto';
import { UsePipes } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common/pipes';
import { TagService } from './tags.service';
import { CreateTagDto } from './createTag-dto';
import { Post, Body, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Tag } from 'src/entities/tag.schema';
import { TagInterfaceResponse } from './interface/TagResponse.interface';

@Controller('tag')
export class TagController {

  constructor(private readonly tagService: TagService) { }

  
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() createTagDto: CreateTagDto): Promise<TagInterfaceResponse | null> {
    return this.tagService.create(createTagDto);
  }


  @Get('getall')
    async getTags(@Query() queryDto: GetQueryDto): Promise<any> {
        return this.tagService.getFilteredTags(queryDto);
    }

  @Get('getbyid/:id')
  async gettagById(@Param('id') id: string): Promise<TagInterfaceResponse | null> {
    return this.tagService.getTagById(id);
  }


  @UsePipes(new ValidationPipe())
  @Put('updatebyid/:id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateTagDto: CreateTagDto,
  ): Promise<TagInterfaceResponse | null> {
    return this.tagService.updateGroup(id, updateTagDto)
  }


  @Delete('deletebyid/:id')
  async deleteTag(@Param('id') id: string): Promise<TagInterfaceResponse | null> {
    return this.tagService.deleteTag(id);
  }

}


