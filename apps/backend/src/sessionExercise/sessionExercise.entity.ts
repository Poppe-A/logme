import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Session } from '../session/session.entity';
import { Exercise } from '../exercise/exercise.entity';
import { Set } from '../set/set.entity';
import { EarlierSessionForInformation } from './sessionExercise.type';

@Entity('session_exercise')
@Unique(['id'])
export class SessionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.sessionExercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Exercise, (exercise) => exercise, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @OneToMany(() => Set, (set) => set.sessionExercise)
  sets: Set[];

  @Column({ type: 'varchar', default: '' })
  comment: string;

  earlierSessionsWithSets?: EarlierSessionForInformation[] | null;
}
