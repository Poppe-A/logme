import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionExercise } from './sessionExercise.entity';
import { Session } from '../session/session.entity';
import { CreateSessionExerciseDto } from './sessionExercise.type';

@Injectable()
export class SessionExerciseService {
  constructor(
    @InjectRepository(SessionExercise)
    private sessionExerciseRepository: Repository<SessionExercise>,
  ) {}

  findAllBySessionId(sessionId: Session['id']): Promise<SessionExercise[]> {
    return this.sessionExerciseRepository.find({
      where: { session: { id: sessionId } },
      relations: { exercise: true },
    });
  }

  async create(createSessionExerciseDto: CreateSessionExerciseDto[]) {
    await this.sessionExerciseRepository.save(createSessionExerciseDto);
  }

  async delete(id: SessionExercise['id']) {
    await this.sessionExerciseRepository.delete(id);
  }

  //   async edit(
  //     sessionId: Session['id'],
  //     editSessionDto: EditSessionDto,
  //   ): Promise<Session | null> {
  //     await this.sessionRepository.update(sessionId, editSessionDto);
  //     return this.sessionRepository.findOne({ where: { id: sessionId } });
  //   }
}
