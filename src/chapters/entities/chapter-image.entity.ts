import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity()
export class ChapterImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.images, {
    onDelete: 'CASCADE',
  })
  chapter: Chapter;
}
