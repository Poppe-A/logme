import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Sport } from '../sport/sport.entity';
import { CreateSessionDto, EditSessionDto } from './session.type';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  findAllByUser(userId: User['id']): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  findBySport(userId: User['id'], sportId: Sport['id']): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { user: { id: userId }, sport: { id: sportId } },
      order: { date: 'DESC' },
    });
  }

  async findAllById(sessionId: Session['id']): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException();
    }

    return session;
  }

  create(createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionRepository.save(createSessionDto);
  }

  async edit(
    sessionId: Session['id'],
    editSessionDto: EditSessionDto,
  ): Promise<Session | null> {
    await this.sessionRepository.update(sessionId, editSessionDto);
    return this.sessionRepository.findOne({ where: { id: sessionId } });
  }
}
