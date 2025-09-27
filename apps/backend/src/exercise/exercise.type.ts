import { Exercise } from './exercise.entity';

export enum ExerciseType {
  REPETITION = 'repetition',
  DURATION = 'duration',
  DISTANCE = 'distance',
}

export interface CreateOrUpdateExerciseDto {
  name: Exercise['name'];
  type: Exercise['type'];
  description?: Exercise['description'];
  altName?: Exercise['altName'];
  secondAltName?: Exercise['secondAltName'];
}
