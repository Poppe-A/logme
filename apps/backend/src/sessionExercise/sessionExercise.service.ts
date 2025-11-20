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
        this.getFormattedSessionExerciseWithPreviousSets(
          sessionExercise,
          userId,
          session.startDate,
        ),
    );

    return Promise.all(sessionsFormattedWithEarlierSessionsData);
  }

  async findById(sessionExerciseId: SessionExercise['id'], userId: User['id']) {
    const sessionExercise = await this.sessionExerciseRepository.findOne({
      where: { id: sessionExerciseId },
      relations: { session: true, exercise: true },
      select: { session: { id: true, name: true, startDate: true } },
    });

    if (sessionExercise) {
      return this.getFormattedSessionExerciseWithPreviousSets(
        sessionExercise,
        userId,
        sessionExercise?.session.startDate,
      );
    }

    // todo handle error
  }

  async getFormattedSessionExerciseWithPreviousSets(
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

    console.log('earlierSessionWith Sets', earlierSessionWithSets.length);
    if (earlierSessionWithSets.length) {
      const exerciseId = sessionExercise.exercise.id;
      formattedEarlierSession = earlierSessionWithSets
        .map((session) => {
          const matchingSessionExercise = session.sessionExercises?.find(
            (sessionExercise) => sessionExercise.exercise?.id === exerciseId,
          );
          return {
            name: session.name,
            startDate: session.startDate,
            comment: matchingSessionExercise?.comment || '',
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

  async upsertComment(
    id: SessionExercise['id'],
    userId: User['id'],
    comment: SessionExercise['comment'],
  ) {
    await this.sessionExerciseRepository.update({ id }, { comment });
    return this.findById(id, userId);
  }
}
