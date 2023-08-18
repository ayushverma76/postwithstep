import { StepSchema } from 'src/entities/step.schema';
import { TagSchema } from 'src/entities/tag.schema';
import { GroupSchema } from 'src/entities/group.schema';
import { PostsSchema } from 'src/entities/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Posts', schema: PostsSchema }, { name: 'Group', schema: GroupSchema },{ name: 'Step', schema: StepSchema },{ name: 'Tag', schema: TagSchema }]),],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostModule { }
