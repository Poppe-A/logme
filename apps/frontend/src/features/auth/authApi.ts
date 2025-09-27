import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../utils/axiosBaseQuery';
import { setAccessToken, setAuthenticatedUser } from './authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['AuthUser'],
  endpoints: build => ({
    login: build.mutation<
      { accessToken: string; user: AuthenticatedUser },
      { email: string; password: string }
    >({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('--- login data', data);
          dispatch(setAccessToken({ accessToken: data.accessToken }));
          dispatch(setAuthenticatedUser({ user: data.user }));
          dispatch(
            authApi.util.updateQueryData(
              'getAuthenticatedUser', // todo entre setCredential et getAuthenticatedUSer, redondance
              undefined,
              () => data.user,
            ),
          );
        } catch (e) {
          console.log('[ERROR] login', e);
        }
      },
      invalidatesTags: ['AuthUser'],
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['AuthUser'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // dispatch(logout());
          dispatch(setAccessToken({ accessToken: null }));
          dispatch(setAuthenticatedUser({ user: null }));
          dispatch(
            authApi.util.updateQueryData(
              'getAuthenticatedUser',
              undefined,
              () => undefined,
            ),
          );
        } catch (e) {
          console.log('[ERROR] logout', e);
        }
      },
    }),

    getAuthenticatedUser: build.query<AuthenticatedUser | undefined, void>({
      query: () => ({ url: '/auth/whoami', method: 'GET' }),
      providesTags: ['AuthUser'],
    }),

    refreshToken: build.mutation<
      { accessToken: string; user: AuthenticatedUser },
      void
    >({
      query: () => {
        console.log('call refresh route');
        return { url: '/auth/refresh', method: 'POST' };
      },
    }),
  }),
});

export type AuthenticatedUser = {
  id: number;
  firstname: string;
  lastname: string;
};

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAuthenticatedUserQuery,
  useRefreshTokenMutation,
} = authApi;
