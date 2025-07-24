import { Category } from 'src/categories/entities/category.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  status: string; // ongoing, completed, etc.

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  followCount: number;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Chapter, (chapter) => chapter.story, { cascade: true })
  chapters: Chapter[];

  @ManyToMany(() => Category, (category) => category.stories, { cascade: true })
  @JoinTable()
  categories: Category[];
}
