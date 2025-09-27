import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Sport } from '../sport/sport.entity';
import { SessionExercise } from '../sessionExercise/sessionExercise.entity';

@Entity('session')
@Unique(['id'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Sport, (sport) => sport)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @OneToMany(
    () => SessionExercise,
    (sessionExercise) => sessionExercise.session,
  )
  sessionExercises: SessionExercise[];

  @Column({ type: 'varchar', nullable: true })
  description?: string;
}
