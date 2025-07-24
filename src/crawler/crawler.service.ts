import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CrawlerService {
  async crawlAllStory(): Promise<void> {
    console.log('>>> Bắt đầu crawlAllStory()');
    const responseListStory = await axios.get(
      'https://otruyenapi.com/v1/api/home',
    );
    console.log('crawl list story');
  }
}
