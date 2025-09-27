import type { Dayjs } from 'dayjs';
import type { Exercise } from '../exercise/exerciseApi';
import type { Sport } from '../sport/sportApi';

export interface CreateSessionDto {
  sportId: Sport['id'];
  name: string;
  description?: 'string';
  startDate: Date;
  exercises?: Exercise['id'][];
}

export interface Session {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  sport: Sport;
  sessionExercises?: SessionExercise[];
}

export interface SessionExercise {
  id: number;
  exercise: Exercise;
}

export interface INewSessionFormData {
  name: Session['name'];
  startDate: Dayjs;
  sportId: Sport['id'] | undefined;
  exercises: Exercise['id'][];
}
