import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CrawlerService {
  async crawlAllStory(): Promise<void> {
    for (let page = 1; page <= 10; page++) {
      const response = await axios.get(
        `https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=${page}`,
      );

      const items = response.data.data.items;

      for (const story of items) {
        const slug = story.slug;
        await this.crawlStoryDetail(slug);
      }
    }
  }

  async crawlStoryDetail(slug: string): Promise<void> {
    try {
      const response = await axios.get(
        `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`,
      );

      const storyDetail = response.data?.data.item;
      console.log({
        slug: storyDetail.slug,
        name: storyDetail.name,
        author: storyDetail.author,
        categories: storyDetail.category?.map((c) => c.name),
        status: storyDetail.status,
        thumb_url: storyDetail.thumb_url,
      });

      // TODO: Lưu vào DB nếu cần
    } catch (error) {
      console.error(`❌ Lỗi khi crawl chi tiết truyện "${slug}":`, error.message);
    }
  }
}
