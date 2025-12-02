import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { Session } from '../session/session.entity';
import { SessionExercise } from './sessionExercise.entity';
import { RequestWithMetadatas } from '../auth/auth.types';
import {
  CreateSessionExerciseDto,
  UpsertCommentDto,
} from './sessionExercise.type';

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

  @Post()
  create(
    @Param('sessionId', ParseIntPipe) sessionId: Session['id'],
    @Body() createSessionExerciseDto: CreateSessionExerciseDto,
    @Req() req: RequestWithMetadatas,
  ): Promise<SessionExercise | undefined> {
    return this.sessionExerciseService.create(
      createSessionExerciseDto,
      +req.user.userId,
    );
  }

  @Delete('/:sessionExerciseId')
  async deleteSessionExercise(
    @Param('sessionExerciseId', ParseIntPipe)
    sessionExerciseId: SessionExercise['id'],
  ) {
    // todo guard
    return this.sessionExerciseService.delete(sessionExerciseId);
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
