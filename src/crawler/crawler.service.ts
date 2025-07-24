import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Category } from 'src/categories/entities/category.entity';
import {
  ChapterImage,
  ImageSourceType,
} from 'src/chapters/entities/chapter-image.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { Story } from 'src/stories/entities/story.entity';
import { Repository } from 'typeorm';
import { ChapterApiResponse } from './dto/chapter-detail.dto';
import { StoryDetailResponse } from './dto/story-detail.dto';
import { StoryListResponse } from './dto/story-list.dto';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,

    @InjectRepository(ChapterImage)
    private readonly chapterImageRepo: Repository<ChapterImage>,
  ) {}

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async crawlAllStory(): Promise<void> {
    for (let page = 1; page <= 10; page++) {
      try {
        const response = await axios.get<StoryListResponse>(
          `https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=${page}`,
        );

        const items = response.data?.data?.items || [];

        for (const story of items) {
          const slug = story.slug;
          await this.crawlStoryDetail(slug);
          await this.sleep(500); // Đợi 0.5s giữa các truyện
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`❌ Lỗi khi crawl:`, error.message);
        } else {
          console.error(`❌ Lỗi không xác định:`, error);
        }
      }
    }
  }

  async crawlStoryDetail(slug: string): Promise<void> {
    try {
      const response = await axios.get<StoryDetailResponse>(
        `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`,
      );

      const storyDetail = response.data?.data;
      if (!storyDetail) {
        console.warn(`⚠️ Không tìm thấy chi tiết truyện cho slug: ${slug}`);
        return;
      }

      const categoryNames: string[] = storyDetail.item.category?.map((c) => c.name) || [];
      const categories: Category[] = [];
      for (const name of categoryNames) {
        let category = await this.categoryRepo.findOne({ where: { name } });
        if (!category) {
          category = this.categoryRepo.create({ name });
          await this.categoryRepo.save(category);
        }
        categories.push(category);
      }

      const story = this.storyRepo.create({
        name: storyDetail.item.name,
        author: storyDetail.item.author.join(', '),
        description: storyDetail.item.content,
        status: storyDetail.item.status,
        categories,
      });
      await this.storyRepo.save(story);

      for (const server of storyDetail.item.chapters || []) {
        const chapters = server.server_data || [];

        for (const chapter of chapters) {
          const chapterEntity = this.chapterRepo.create({
            chapterNumber: parseFloat(chapter.chapter_name),
            title: chapter.chapter_title || '',
            story,
          });
          const savedChapter = await this.chapterRepo.save(chapterEntity);

          await this.crawlChapterImages(chapter.chapter_api_data, savedChapter);
          await this.sleep(300);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ Lỗi khi crawl:`, error.message);
      } else {
        console.error(`❌ Lỗi không xác định:`, error);
      }
    }
  }

  async crawlChapterImages(
    chapterApiUrl: string,
    chapter: Chapter,
  ): Promise<void> {
    try {
      const response = await axios.get<ChapterApiResponse>(chapterApiUrl);
      const data = response.data?.data;

      if (!data?.item?.chapter_image) {
        console.warn(`⚠️ Không tìm thấy ảnh trong chương: ${chapterApiUrl}`);
        return;
      }

      const domain = data.domain_cdn.replace(/\/$/, '');
      const chapterPath = data.item.chapter_path.replace(/^\/|\/$/g, '');
      const imageList = data.item.chapter_image;

      for (const img of imageList) {
        const fullUrl = `${domain}/${chapterPath}/${img.image_file}`;
        const image = this.chapterImageRepo.create({
          imagePath: fullUrl,
          sourceType: ImageSourceType.INTERNAL,
          chapter,
        });
        await this.chapterImageRepo.save(image);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ Lỗi khi crawl:`, error.message);
      } else {
        console.error(`❌ Lỗi không xác định:`, error);
      }
    }
  }
}
