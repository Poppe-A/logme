import type { Dayjs } from 'dayjs';
import type { Exercise } from '../exercise/exerciseApi';
import type { Sport } from '../sport/sportApi';
import type { Set } from '../set/types';
import type { Control, FieldValues } from 'react-hook-form';

export interface CreateSessionDto {
  sportId: Sport['id'];
  name: string;
  description?: 'string';
  startDate: Date;
  exercises?: Exercise['id'][];
}

export interface UpdateSessionDto {
  sessionId: Session['id'];
  description?: 'string';
  endDate?: Date;
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

export interface FormSet {
  id?: Set['id'];
  repetitions: Set['repetitions'];
  weight?: Set['weight'];
}

export interface FormValue {
  sets: FormSet[];
}

export interface ISetRow<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  index: number;
  isNew?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
}
