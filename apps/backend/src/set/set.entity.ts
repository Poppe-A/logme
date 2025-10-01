import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SessionExercise } from '../sessionExercise/sessionExercise.entity';

@Entity('set')
@Unique(['id'])
export class Set {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  repetitions: number;

  @Column({ type: 'int', nullable: true })
  weight?: number;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => SessionExercise, (sessionExercise) => sessionExercise)
  @JoinColumn({ name: 'session_exercise_id' })
  sessionExercise: SessionExercise;
}
