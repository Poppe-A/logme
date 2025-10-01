import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionExercise } from '../sessionExercise/sessionExercise.entity';
import { Set } from './set.entity';
import { Session } from '../session/session.entity';
import { UpsertSetDto } from './set.types';

@Injectable()
export class SetService {
  constructor(
    @InjectRepository(Set)
    private setRepository: Repository<Set>,
  ) {}

  findAllBySessionId(sessionId: Session['id']): Promise<Set[]> {
    return this.setRepository.find({
      where: { sessionExercise: { session: { id: sessionId } } },
      relations: { sessionExercise: true },
      select: { sessionExercise: { id: true } },
      order: { order: 'ASC' },
    });
  }

  async addSet(
    sessionExerciseId: SessionExercise['id'],
    createSetDto: UpsertSetDto,
  ): Promise<Set> {
    const highestOrderSet = await this.setRepository.findOne({
      where: { sessionExercise: { id: sessionExerciseId } },
      order: { order: 'DESC' },
    });
    const set = await this.setRepository.save({
      ...createSetDto,
      sessionExercise: { id: sessionExerciseId },
      order:
        highestOrderSet && highestOrderSet.order >= 0
          ? highestOrderSet.order + 1
          : 0,
    });
    return set;
  }

  async editSet(setId: Set['id'], updateSetDto: UpsertSetDto): Promise<Set> {
    await this.setRepository.update({ id: setId }, updateSetDto);
    const set = await this.setRepository.findOne({ where: { id: setId } });
    return set as Set;
  }

  async deleteSet(setId: Set['id']) {
    await this.setRepository.delete(setId);
    return setId;
  }
}
