import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { SessionService } from '../session/session.service';
import { GetForDashboardResponse } from './data.type';

@Injectable()
export class DataService {
  constructor(private sessionService: SessionService) {}

  async getForDashboard(userId: User['id']): Promise<GetForDashboardResponse> {
    console.log('getForDashboard', userId);
    const lastTenDaysSessions =
      await this.sessionService.findLastTenDaysSessions(userId);

    return {
      lastTenDaysSessionsNumber: lastTenDaysSessions.length ?? 0,
      lastSessions: lastTenDaysSessions.slice(0, 3) ?? [],
    };
  }
}
