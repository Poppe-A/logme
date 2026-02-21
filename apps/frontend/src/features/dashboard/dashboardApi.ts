import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../utils/axiosBaseQuery';
import type { Session } from '../session/types';

export type GetForDashboardResponse = {
  lastTenDaysSessionsNumber: number;
  lastSessions: Session[];
};

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Dashboard'],
  endpoints: build => ({
    getForDashboard: build.query<GetForDashboardResponse, void>({
      query: () => ({
        url: '/data/get-for-dashboard',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetForDashboardQuery } = dashboardApi;
