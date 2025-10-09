import { Exercise } from '../exercise/exercise.entity';
import { Session } from '../session/session.entity';
import { Set } from '../set/set.entity';

export interface CreateSessionExerciseDto {
  session: {
    id: Session['id'];
  };
  exercise: {
    id: Exercise['id'];
  };
}

export interface EarlierSessionForInformation {
  name: Session['name'];
  startDate: Session['startDate'];
  sets: Set[];
}
