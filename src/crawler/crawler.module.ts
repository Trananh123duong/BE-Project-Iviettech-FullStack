import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { DailyCrawlJob } from './daily-crawl.job';
import { CrawlerController } from './crawler.controller';

@Module({
  providers: [CrawlerService, DailyCrawlJob],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
