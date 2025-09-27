import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../utils/axiosBaseQuery';

export type Sport = {
  id?: number;
  name: string;
  description?: string;
};

export const sportApi = createApi({
  reducerPath: 'sportApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Sports'],
  endpoints: build => ({
    getSports: build.query<Sport[], void>({
      query: () => ({ url: '/sports', method: 'GET' }),
      providesTags: ['Sports'],
    }),

    updateSport: build.mutation<Sport[], Sport>({
      query: data => ({
        url: `/sports/${data.id}`,
        method: 'PATCH',
        data: data,
      }),
      // Pas besoin d'invalidate ici : on met directement à jour la liste
      async onQueryStarted({ id, ...patchData }, { dispatch, queryFulfilled }) {
        console.log('update ', id, patchData);
        try {
          const { data: updatedSportsList } = await queryFulfilled;
          // Remplace entièrement le cache de getSports par la nouvelle liste
          dispatch(
            sportApi.util.updateQueryData(
              'getSports',
              undefined,
              () => updatedSportsList,
            ),
          );
        } catch (error) {
          console.error('Erreur lors de la mise à jour du sport', error);
        }
      },
    }),
    createSport: build.mutation<Sport[], Omit<Sport, 'id'>>({
      query: data => ({
        url: `/sports`,
        method: 'POST',
        data: data,
      }),
      // Pas besoin d'invalidate ici : on met directement à jour la liste
      async onQueryStarted(postData, { dispatch, queryFulfilled }) {
        console.log('create ', postData);
        try {
          const { data: sportList } = await queryFulfilled;
          // Remplace entièrement le cache de getSports par la nouvelle liste
          dispatch(
            sportApi.util.updateQueryData(
              'getSports',
              undefined,
              () => sportList,
            ),
          );
        } catch (error) {
          console.error('Erreur lors de la création du sport', error);
        }
      },
    }),
  }),
});

export const {
  useGetSportsQuery,
  useUpdateSportMutation,
  useCreateSportMutation,
} = sportApi;
