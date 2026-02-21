import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('setting')
@Unique(['user'])
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'dashboard_last_sessions', type: 'boolean', default: true })
  dashboardLastSessions: boolean;

  @Column({ name: 'dashboard_weight', type: 'boolean', default: true })
  dashboardWeight: boolean;

  @Column({ name: 'dashboard_heart_rate', type: 'boolean', default: true })
  dashboardHeartRate: boolean;

  @Column({ name: 'health_weight', type: 'boolean', default: true })
  healthWeight: boolean;

  @Column({ name: 'health_heart_rate', type: 'boolean', default: true })
  healthHeartRate: boolean;
}
