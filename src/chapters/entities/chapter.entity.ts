import { Story } from 'src/stories/entities/story.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Story, (story) => story.chapters, { onDelete: 'CASCADE' })
  story: Story;

  @OneToMany(() => ChapterImage, (image) => image.chapter, { cascade: true })
  images: ChapterImage[];
}
