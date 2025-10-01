import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './set.entity';
import { SetController } from './set.controller';
import { SetService } from './set.service';

@Module({
  imports: [TypeOrmModule.forFeature([Set])],
  controllers: [SetController],
  providers: [SetService],
})
export class SetModule {}
