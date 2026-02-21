import { Session } from '../session/session.entity';

export type GetForDashboardResponse = {
  lastTenDaysSessionsNumber: number;
  lastSessions: Session[];
};
