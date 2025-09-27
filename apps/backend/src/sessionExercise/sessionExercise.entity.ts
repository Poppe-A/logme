import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Session } from '../session/session.entity';
import { Exercise } from '../exercise/exercise.entity';

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
}
