import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { Session } from '../session/session.entity';
import { SessionExercise } from './sessionExercise.entity';

@Controller('sessions/:sessionId/exercises')
export class SessionExerciseController {
  constructor(private sessionExerciseService: SessionExerciseService) {}
  @Get()
  findAllByUser(
    @Param('sessionId', ParseIntPipe) sessionId: Session['id'],
  ): Promise<SessionExercise[]> {
    return this.sessionExerciseService.findAllBySessionId(sessionId);
  }
}
