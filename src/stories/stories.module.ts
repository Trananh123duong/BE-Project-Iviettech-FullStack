import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { Story } from './entities/story.entity';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Chapter])],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
