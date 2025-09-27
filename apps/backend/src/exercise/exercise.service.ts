import { Injectable } from '@nestjs/common';
import { Exercise } from './exercise.entity';
import { Repository } from 'typeorm';
import { CreateOrUpdateExerciseDto } from './exercise.type';
import { Sport } from '../sport/sport.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  findBySport(sportId: Sport['id']): Promise<Exercise[]> {
    return this.exerciseRepository.find({ where: { sport: { id: sportId } } });
  }

  async create(
    createExerciseDto: CreateOrUpdateExerciseDto,
    sportId: Sport['id'],
  ): Promise<Exercise[]> {
    await this.exerciseRepository.save({
      ...createExerciseDto,
      sport: { id: sportId },
    });
    return this.findBySport(sportId);
  }

  async update(
    sportId: Sport['id'],
    exerciseId: Exercise['id'],
    updateExerciseDto: CreateOrUpdateExerciseDto,
  ): Promise<Exercise[]> {
    await this.exerciseRepository.update({ id: exerciseId }, updateExerciseDto);
    return this.findBySport(sportId);
  }
}
