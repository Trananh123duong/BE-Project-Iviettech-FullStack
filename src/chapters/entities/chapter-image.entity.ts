import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

export enum ImageSourceType {
  EXTERNAL = 'EXTERNAL', //https://otruyenapi.com/assets/images/chap123/img01.jpg
  INTERNAL = 'INTERNAL', ///uploads/chapters/123/img01.jpg
}

@Entity()
export class ChapterImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imagePath: string;

  @Column({
    type: 'enum',
    enum: ImageSourceType,
    default: ImageSourceType.EXTERNAL,
  })
  sourceType: ImageSourceType;

  @ManyToOne(() => Chapter, (chapter) => chapter.images, {
    onDelete: 'CASCADE',
  })
  chapter: Chapter;
}
