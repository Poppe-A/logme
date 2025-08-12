import { Injectable } from '@nestjs/common';
import { Exercise } from './exercise.entity';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './exercise.type';
import { Sport } from '../sport/sport.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async create(
    createExerciseDto: CreateExerciseDto,
    sportId: Sport['id'],
  ): Promise<Exercise[]> {
    await this.exerciseRepository.save({
      ...createExerciseDto,
      sport: { id: sportId },
    });
    return this.findBySport(sportId);
  }

  findBySport(sportId: Sport['id']): Promise<Exercise[]> {
    return this.exerciseRepository.find({ where: { sport: { id: sportId } } });
  }
}
