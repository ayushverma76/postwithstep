import { TagSchema } from 'src/entities/tag.schema';
import { GroupSchema } from 'src/entities/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TagController } from './tags.controller';
import { TagService } from './tags.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule { }
