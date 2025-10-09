import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { Session } from '../session/session.entity';
import { SessionExercise } from './sessionExercise.entity';
import { RequestWithMetadatas } from '../auth/auth.types';

@Controller('sessions/:sessionId/exercises')
export class SessionExerciseController {
  constructor(private sessionExerciseService: SessionExerciseService) {}
  @Get()
  findAllByUser(
    @Param('sessionId', ParseIntPipe) sessionId: Session['id'],
    @Req() req: RequestWithMetadatas,
  ): Promise<SessionExercise[]> {
    return this.sessionExerciseService.findAllBySessionId(
      sessionId,
      +req.user.userId,
    );
  }
}
