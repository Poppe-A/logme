import type { Session, SessionExercise } from '../session/types';

export interface Set {
  id: number;
  sessionExercise: { id: SessionExercise['id'] };
  repetitions: number;
  weight?: number;
}

export interface UpsertSetDto {
  data: {
    repetitions: Set['repetitions'];
    weight?: Set['weight'];
  };
  id?: Set['id'];
  sessionId: Session['id'];
  sessionExerciseId: SessionExercise['id'];
}

export interface DeleteSetDto {
  id?: Set['id'];
  sessionId: Session['id'];
  sessionExerciseId: SessionExercise['id'];
}
