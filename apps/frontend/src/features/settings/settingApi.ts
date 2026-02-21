import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../utils/axiosBaseQuery';

export enum SettingKey {
  DASHBOARD_LAST_SESSIONS = 'dashboardLastSessions',
  DASHBOARD_WEIGHT = 'dashboardWeight',
  DASHBOARD_HEART_RATE = 'dashboardHeartRate',
  HEALTH_WEIGHT = 'healthWeight',
  HEALTH_HEART_RATE = 'healthHeartRate',
}

export type SettingsBody = Record<SettingKey, boolean>;

export const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Setting'],
  endpoints: build => ({
    getSettings: build.query<SettingsBody, void>({
      query: () => ({
        url: '/settings',
        method: 'GET',
      }),
      providesTags: ['Setting'],
    }),
    updateSettings: build.mutation<SettingsBody, SettingsBody>({
      query: settings => ({
        url: '/settings',
        method: 'PATCH',
        data: settings,
      }),
      invalidatesTags: ['Setting'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingApi;
