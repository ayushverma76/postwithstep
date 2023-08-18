import { GetQueryDto } from 'src/post/query-dto';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { UsePipes } from '@nestjs/common/decorators';
import { CreateGroupDto } from './createGroup-dto';
import { Post, Body, Get, Put, Delete, Query, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from 'src/entities/group.schema';
import { GroupInterfaceResponse } from './interface/GroupResponse.interface';

@Controller('group')
export class GroupController {

  constructor(private readonly groupService: GroupService) { }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() createGroupDto: CreateGroupDto): Promise<GroupInterfaceResponse | null> {
    return this.groupService.create(createGroupDto);
  }


  @Get('getall')
  async getGroups(@Query() queryDto: GetQueryDto): Promise<any> {
    return this.groupService.getFilteredPosts(queryDto);
  }


  @Get('getbyid/:id')
  async getGroupById(@Param('id') id: string): Promise<GroupInterfaceResponse | null> {
    return this.groupService.getGroupById(id);
  }


  @UsePipes(new ValidationPipe())
  @Put('updatebyid/:id')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: CreateGroupDto,
  ): Promise<GroupInterfaceResponse | null> {
    return this.groupService.updateGroup(id, updateGroupDto)
  }


  @Delete('deletebyid/:id')
  async deleteGroup(@Param('id') id: string): Promise<GroupInterfaceResponse | null> {
    return this.groupService.deleteGroup(id);
  }

}
