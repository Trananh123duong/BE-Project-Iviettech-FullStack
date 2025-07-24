import { Category } from 'src/categories/entities/category.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Chapter, (chapter) => chapter.story, { cascade: true })
  chapters: Chapter[];

  @ManyToMany(() => Category, (category) => category.stories, { cascade: true })
  @JoinTable({
    name: 'story_category',
    joinColumn: {
      name: 'story_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
}
