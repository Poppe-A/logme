import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { HealthType } from './health.type';

@Entity('health')
@Unique(['id'])
@Unique(['user', 'date', 'type'])
export class Health {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  value: string;

  @Column({ type: 'enum', enum: HealthType, nullable: false })
  type: HealthType;

  @Column({ type: 'date' })
  date: Date;
}
