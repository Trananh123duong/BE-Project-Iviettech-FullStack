import { Story } from 'src/stories/entities/story.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
