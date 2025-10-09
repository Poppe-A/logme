import { forwardRef, Module } from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionExercise } from './sessionExercise.entity';
import { SessionExerciseController } from './sessionExercise.controller';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionExercise]),
    forwardRef(() => SessionModule),
  ],
  controllers: [SessionExerciseController],
  providers: [SessionExerciseService],
  exports: [SessionExerciseService],
})
export class SessionExerciseModule {}
