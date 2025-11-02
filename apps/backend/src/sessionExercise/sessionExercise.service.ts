import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionExercise } from './sessionExercise.entity';
import { Session } from '../session/session.entity';
import {
  CreateSessionExerciseDto,
  EarlierSessionForInformation,
} from './sessionExercise.type';
import { SessionService } from '../session/session.service';
import { User } from '../user/user.entity';

@Injectable()
export class SessionExerciseService {
  constructor(
    @InjectRepository(SessionExercise)
    private sessionExerciseRepository: Repository<SessionExercise>,
    @Inject(forwardRef(() => SessionService))
    private sessionService: SessionService,
  ) {}

  async findAllBySessionId(
    sessionId: Session['id'],
    userId: User['id'],
  ): Promise<SessionExercise[]> {
    const session = await this.sessionService.findById(sessionId);
    if (session.user.id !== userId) {
      throw new UnauthorizedException();
    }

    const sessionExercises = await this.sessionExerciseRepository.find({
      where: { session: { id: sessionId } },
      relations: { session: true, exercise: true },
      select: {
        session: { id: true, name: true, startDate: true },
      },
    });

    const sessionsFormattedWithEarlierSessionsData = sessionExercises.map(
      (sessionExercise) =>
        this.getFormattedEarlierSessionExercise(
          sessionExercise,
          userId,
          session.startDate,
        ),
    );

    return Promise.all(sessionsFormattedWithEarlierSessionsData);
  }

  async getFormattedEarlierSessionExercise(
    sessionExercise: SessionExercise,
    userId: User['id'],
    maxdate: Session['startDate'],
  ) {
    let formattedEarlierSession: EarlierSessionForInformation[] | null = null;

    const earlierSessionWithSets =
      await this.sessionService.findLastByUserAndSessionExerciseId(
        userId,
        sessionExercise.exercise.id,
        maxdate,
      );

    console.log('earlierSessionWithSets', earlierSessionWithSets.length);
    if (earlierSessionWithSets.length) {
      const exerciseId = sessionExercise.exercise.id;
      formattedEarlierSession = earlierSessionWithSets
        .map((session) => {
          const matchingSessionExercise = session.sessionExercises?.find(
            (se) => se.exercise?.id === exerciseId,
          );
          return {
            name: session.name,
            startDate: session.startDate,
            sets: matchingSessionExercise?.sets || [],
          };
        })
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    console.log(formattedEarlierSession);

    return {
      ...sessionExercise,
      earlierSessionsWithSets: formattedEarlierSession,
    };
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
