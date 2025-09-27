import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Sport } from '../sport/sport.entity';
import { ExerciseService } from './exercise.service';
import { Exercise } from './exercise.entity';
import { CreateOrUpdateExerciseDto } from './exercise.type';

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
    @Body() createExerciseDto: CreateOrUpdateExerciseDto,
  ): Promise<Exercise[]> {
    return this.exerciseService.create(createExerciseDto, sportId);
  }

  @Patch('/:id')
  updateSport(
    @Body() updateExerciseDto: CreateOrUpdateExerciseDto,
    @Param('id') id: Exercise['id'],
    @Param('sportId') sportId: Sport['id'],
  ): Promise<Sport[]> {
    console.log('id, sportid', id, sportId);
    return this.exerciseService.update(sportId, id, updateExerciseDto);
  }
}
