import { Module } from '@nestjs/common';
import { SessionExerciseService } from './sessionExercise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionExercise } from './sessionExercise.entity';
import { SessionExerciseController } from './sessionExercise.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionExercise])],
  controllers: [SessionExerciseController],
  providers: [SessionExerciseService],
  exports: [SessionExerciseService],
})
export class SessionExerciseModule {}
