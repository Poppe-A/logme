import { Exercise } from '../exercise/exercise.entity';
import { Session } from '../session/session.entity';

export interface CreateSessionExerciseDto {
  session: {
    id: Session['id'];
  };
  exercise: {
    id: Exercise['id'];
  };
}
