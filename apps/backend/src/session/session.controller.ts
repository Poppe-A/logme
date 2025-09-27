import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { RequestWithMetadatas } from '../auth/auth.types';
import { CreateSessionDto, EditSessionDto } from './session.type';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}
  @Get()
  findAllByUser(@Req() req: RequestWithMetadatas): Promise<Session[]> {
    return this.sessionService.findAllByUser(req.user.userId);
  }

  @Get('/:sessionId')
  findSessionById(
    @Param('sessionId') sessionId: string,
  ): Promise<Session | null> {
    return this.sessionService.findById(+sessionId);
  }

  @Get('/sports/:sportId/sessions')
  findBySport(
    @Req() req: RequestWithMetadatas,
    @Param('sportId') sportId: string,
  ): Promise<Session[]> {
    return this.sessionService.findBySport(req.user.userId, +sportId);
  }

  @Get('/current')
  findCurrent(@Req() req: RequestWithMetadatas): Promise<Session | null> {
    return this.sessionService.findCurrent(req.user.userId);
  }

  @Post()
  create(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: RequestWithMetadatas,
  ): Promise<Session['id']> {
    return this.sessionService.create({
      ...createSessionDto,
      userId: req.user.userId,
    });
  }

  @Patch('/:sessionId')
  edit(
    @Body() editSessionDto: EditSessionDto,
    @Req() req: RequestWithMetadatas,
    @Param('sportId') sportId: string,
    @Param('sessionId') sessionId: string,
  ): Promise<Session | null> {
    return this.sessionService.edit(+sessionId, editSessionDto);
  }
}
