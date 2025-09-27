import { Exercise } from '../exercise/exercise.entity';
import { Sport } from '../sport/sport.entity';
import { User } from '../user/user.entity';
import { Session } from './session.entity';

export interface CreateSessionDto {
  sportId: Sport['id'];
  userId: User['id'];
  name: Session['name'];
  description?: Session['description'];
  date: Date;
  exercises?: Exercise['id'][];
}

export interface EditSessionDto {
  name: Session['name'];
  description: Session['description'];
  date: Date;
}
