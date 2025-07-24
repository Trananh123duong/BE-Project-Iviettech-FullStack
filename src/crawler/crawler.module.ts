import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ChapterImage } from 'src/chapters/entities/chapter-image.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { Story } from 'src/stories/entities/story.entity';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { DailyCrawlJob } from './daily-crawl.job';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Category, Chapter, ChapterImage])],
  providers: [CrawlerService, DailyCrawlJob],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
