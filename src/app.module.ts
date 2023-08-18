import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { GroupModule } from './group/group.module';
import { TagController } from './tag/tags.controller';
import { TagService } from './tag/tags.service';
import { TagModule } from './tag/tags.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb+srv://ayushv657:gkczp9LJXpkYnN7u@cluster0.stthbi5.mongodb.net/mydatabase?retryWrites=true&w=majority"),
    PostModule,
    GroupModule,
    TagModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
