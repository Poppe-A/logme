import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ExerciseType } from './exercise.type';
import { Sport } from '../sport/sport.entity';

@Entity('exercise')
@Unique(['id'])
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ExerciseType, nullable: true })
  type: ExerciseType;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'alt_name', type: 'varchar', nullable: true })
  altName?: string;

  @Column({ name: 'second_alt_name', type: 'varchar', nullable: true })
  secondAltName?: string;

  @ManyToOne(() => Sport, (sport) => sport)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;
}
