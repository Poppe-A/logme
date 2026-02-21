import { Module } from '@nestjs/common';

import { DataController } from './data.controller';
import { DataService } from './data.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
