import { Set } from './set.entity';

export interface UpsertSetDto {
  repetitions: Set['repetitions'];
  weight: Set['weight'];
}
