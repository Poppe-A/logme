import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Session } from '../session/session.entity';
import { SetService } from './set.service';
import { Set } from './set.entity';
import { UpsertSetDto } from './set.types';
import { SessionExercise } from '../sessionExercise/sessionExercise.entity';

@Controller('sessions/:sessionId')
export class SetController {
  constructor(private setService: SetService) {}
  // todo guards to check user can access
  @Get('/sets')
  findAllBySession(
    @Param('sessionId', ParseIntPipe) sessionId: Session['id'],
  ): Promise<Set[]> {
    return this.setService.findAllBySessionId(sessionId);
  }

  @Post('session-exercises/:sessionExerciseId/sets')
  addSet(
    @Param('sessionExerciseId', ParseIntPipe)
    sessionExerciseId: SessionExercise['id'],
    @Body() createSetDto: UpsertSetDto,
  ): Promise<Set> {
    return this.setService.addSet(sessionExerciseId, createSetDto);
  }

  @Patch('session-exercises/:sessionExerciseId/sets/:id')
  editSet(
    @Param('id', ParseIntPipe) id: Set['id'],
    @Body() updateSetDto: UpsertSetDto,
  ): Promise<Set> {
    return this.setService.editSet(id, updateSetDto);
  }

  @Delete('session-exercises/:sessionExerciseId/sets/:id')
  deleteSet(@Param('id', ParseIntPipe) id: Set['id']) {
    return this.setService.deleteSet(id);
  }
}
