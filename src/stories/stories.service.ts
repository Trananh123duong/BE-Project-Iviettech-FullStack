import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>,
  ) { }

  create(createStoryDto: CreateStoryDto) {
    return 'This action adds a new story';
  }

  async findAll(page = 1, limit = 10) {
    try {
      const [stories, total] = await this.storyRepo
        .createQueryBuilder('story')
        .select([
          'story.id',
          'story.name',
          'story.viewCount',
          'story.followCount',
        ])
        .orderBy('story.updatedAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const storiesWithChapters = await Promise.all(
        stories.map(async (story) => {
          const latestChapters = await this.storyRepo.manager
            .getRepository('Chapter')
            .createQueryBuilder('chapter')
            .select([
              'chapter.id',
              'chapter.chapterNumber',
              'chapter.title',
              'chapter.updatedAt',
            ])
            .where('chapter.storyId = :storyId', { storyId: story.id })
            .orderBy('chapter.chapterNumber', 'DESC')
            .limit(3)
            .getMany();

          return {
            ...story,
            latestChapters,
          };
        }),
      );

      return {
        data: storiesWithChapters,
        total,
        currentPage: page,
        pageSize: limit,
      };
    } catch (error) {
      console.error('❌ Error in getStoriesWithLatestChapters:', error);
      throw new InternalServerErrorException('Không thể lấy danh sách truyện');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} story`;
  }

  update(id: number, updateStoryDto: UpdateStoryDto) {
    return `This action updates a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
