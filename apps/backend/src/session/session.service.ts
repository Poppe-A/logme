import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Sport } from '../sport/sport.entity';
import { CreateSessionDto, EditSessionDto } from './session.type';
import { SessionExerciseService } from '../sessionExercise/sessionExercise.service';
import { SessionExercise } from '../sessionExercise/sessionExercise.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private sessionExerciseService: SessionExerciseService,
  ) {}

  async findById(id: Session['id']): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: { sport: true, user: true },
      select: { sport: { name: true, id: true }, user: { id: true } },
    });

    if (!session) {
      throw new NotFoundException();
    }

    return session;
  }

  findAllByUser(userId: User['id']): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
      relations: { sport: true, sessionExercises: { exercise: true } },
      select: {
        sport: { name: true },
        sessionExercises: { id: true, exercise: { name: true } },
      },
    });
  }

  async findLastByUserAndSessionExerciseId(
    userId: User['id'],
    sessionExerciseExerciseId: SessionExercise['exercise']['id'],
    maxdate: Session['startDate'],
  ) {
    console.log('--- findLastByUserAndSessionExerciseId');
    const sessions = await this.sessionRepository.find({
      where: {
        user: { id: userId },
        sessionExercises: { exercise: { id: sessionExerciseExerciseId } },
        endDate: Not(IsNull()),
        startDate: LessThan(maxdate),
      },
      relations: { sessionExercises: { exercise: true, sets: true } },
      order: {
        startDate: 'DESC',
      },
      take: 2,
    });
    console.log(
      '--- sessions',
      sessions.map((session) => session),
    );

    // Filtrer les sessions pour ne garder que celles où le sessionExercise concerné a des sets
    return sessions.filter((session) => {
      const sessionExercise = session.sessionExercises?.find(
        (se) => se?.exercise.id === sessionExerciseExerciseId,
      );
      return (
        sessionExercise &&
        sessionExercise.sets &&
        sessionExercise.sets.length > 0
      );
    });
  }

  findBySport(userId: User['id'], sportId: Sport['id']): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { user: { id: userId }, sport: { id: sportId } },
      order: { startDate: 'DESC' },
    });
  }

  findCurrent(userId: User['id']): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { user: { id: userId }, endDate: IsNull() },
      order: { startDate: 'DESC' },
    });
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session['id']> {
    const { userId, sportId, name, startDate } = createSessionDto;

    const sessionToCreate = {
      sport: { id: sportId },
      user: { id: userId },
      name,
      description: '',
      startDate,
    };

    const session = await this.sessionRepository.save(sessionToCreate);
    const exercises = createSessionDto.exercises;

    if (exercises?.length) {
      const sessionExercisesToCreate = exercises.map((exerciseId) => ({
        session: { id: session.id },
        exercise: { id: exerciseId },
      }));
      console.log(sessionExercisesToCreate);
      await this.sessionExerciseService.createMultiple(
        sessionExercisesToCreate,
      );
    }

    return session.id;
  }

  async edit(
    sessionId: Session['id'],
    editSessionDto: EditSessionDto,
  ): Promise<Session | null> {
    const endDate = editSessionDto.endDate ? new Date() : null;
    console.log('ededed', endDate);
    await this.sessionRepository.update(sessionId, {
      ...editSessionDto,
      endDate,
    });
    return this.findById(sessionId);
  }

  async delete(sessionId: Session['id']): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }
}
