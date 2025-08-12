import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Sport } from '../sport/sport.entity';
import { ExerciseService } from './exercise.service';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './exercise.type';

@Controller('sports/:sportId/exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  findAll(@Param('sportId') sportId: Sport['id']): Promise<Exercise[]> {
    return this.exerciseService.findBySport(sportId);
  }

  @Post()
  createExercise(
    @Param('sportId') sportId: Sport['id'],
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise[]> {
    return this.exerciseService.create(createExerciseDto, sportId);
  }
}
