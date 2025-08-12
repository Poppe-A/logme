import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Sport } from '../sport/sport.entity';

@Entity('session')
@Unique(['id'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Sport, (sport) => sport)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  duration?: number;
}
