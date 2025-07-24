import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';

@Injectable()
export class DailyCrawlJob {
  constructor(private readonly crawlerService: CrawlerService) {}

  // Chạy vào 7h và 19h mỗi ngày
  @Cron('0 7,19 * * *')
  async handleDailyCrawl() {
    console.log('🕒 Running crawl job at 7h or 19h');
    await this.crawlerService.crawlAllStory();
  }
}
