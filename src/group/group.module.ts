import { GroupSchema } from 'src/entities/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupController } from './group.controller';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule { }
