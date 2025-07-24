import { Story } from 'src/stories/entities/story.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChapterImage } from './chapter-image.entity';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapterNumber: number;

  @Column()
  title: string;

  @ManyToOne(() => Story, (story) => story.chapters, { onDelete: 'CASCADE' })
  story: Story;

  @OneToMany(() => ChapterImage, (image) => image.chapter, { cascade: true })
  images: ChapterImage[];
}
