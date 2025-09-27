import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Sport } from '../sport/sport.entity';
import { CreateSessionDto, EditSessionDto } from './session.type';
import { SessionExerciseService } from '../sessionExercise/sessionExercise.service';

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
      relations: { sport: true },
      select: { sport: { name: true } },
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
    const { userId, sportId, name } = createSessionDto;

    const sessionToCreate = {
      sport: { id: sportId },
      user: { id: userId },
      name,
      description: '',
    };

    const session = await this.sessionRepository.save(sessionToCreate);
    const exercises = createSessionDto.exercises;

    if (exercises?.length) {
      const sessionExercisesToCreate = exercises.map((exerciseId) => ({
        session: { id: session.id },
        exercise: { id: exerciseId },
      }));
      console.log(sessionExercisesToCreate);
      await this.sessionExerciseService.create(sessionExercisesToCreate);
    }

    return session.id;
  }

  async edit(
    sessionId: Session['id'],
    editSessionDto: EditSessionDto,
  ): Promise<Session | null> {
    await this.sessionRepository.update(sessionId, editSessionDto);
    return this.findById(sessionId);
  }
}
