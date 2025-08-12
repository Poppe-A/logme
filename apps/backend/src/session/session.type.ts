import { Sport } from '../sport/sport.entity';
import { User } from '../user/user.entity';
import { Session } from './session.entity';

export interface CreateSessionDto {
  sportId: Sport['id'];
  userId: User['id'];
  name: Session['name'];
  description: Session['description'];
  date: Date;
}

export interface EditSessionDto {
  name: Session['name'];
  description: Session['description'];
  date: Date;
}
