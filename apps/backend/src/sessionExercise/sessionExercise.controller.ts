import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { Session } from '../session/session.entity';
import { SessionExercise } from './sessionExercise.entity';
import { RequestWithMetadatas } from '../auth/auth.types';
import { UpsertCommentDto } from './sessionExercise.type';

@Controller('sessions/:sessionId/session-exercises')
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

  @Patch('/:sessionExerciseId/comment')
  async addComment(
    @Param('sessionExerciseId', ParseIntPipe)
    sessionExerciseId: SessionExercise['id'],
    @Req() req: RequestWithMetadatas,
    @Body() createCommentDto: UpsertCommentDto,
  ) {
    return this.sessionExerciseService.upsertComment(
      sessionExerciseId,
      +req.user.userId,
      createCommentDto.comment,
    );
  }
}
