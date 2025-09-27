import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../utils/axiosBaseQuery';
import type { Sport } from '../sport/sportApi';

export const EXERCISE_TYPE = {
  REPETITION: 'repetition',
  DURATION: 'duration',
  DISTANCE: 'distance',
} as const;

export type ExerciseType = (typeof EXERCISE_TYPE)[keyof typeof EXERCISE_TYPE];
// todo move to types
export type Exercise = {
  id?: number; // voir ça
  name: string;
  type?: ExerciseType;
  description?: string;
  altName?: string;
  secondAltName: string;
};

interface IGetExercises {
  sportId: Sport['id'];
}

type IUpdateExercise = {
  exercise: Exercise;
} & IGetExercises;

type ICreateExercise = {
  exercise: Omit<Exercise, 'id'>;
} & IGetExercises;

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Exercises'],
  endpoints: build => ({
    getExercises: build.query<Exercise[], IGetExercises>({
      query: ({ sportId }) => ({
        url: `/sports/${sportId}/exercises`,
        method: 'GET',
      }),
      providesTags: ['Exercises'],
      transformResponse: (response: Exercise[] | undefined) => {
        return Array.isArray(response) ? response : [];
      },
    }),

    updateExercise: build.mutation<Exercise[], IUpdateExercise>({
      query: ({ exercise, sportId }) => ({
        url: `/sports/${sportId}/exercises/${exercise.id}`,
        method: 'PATCH',
        data: exercise,
      }),
      // Pas besoin d'invalidate ici : on met directement à jour la liste
      async onQueryStarted({ sportId }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedExerciseList } = await queryFulfilled;
          // Remplace entièrement le cache de getExercises par la nouvelle liste
          dispatch(
            exerciseApi.util.updateQueryData(
              'getExercises',
              { sportId },
              () => updatedExerciseList,
            ),
          );
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'exercice", error);
        }
      },
    }),
    createExercise: build.mutation<Exercise[], ICreateExercise>({
      query: ({ exercise, sportId }) => ({
        url: `/sports/${sportId}/exercises`,
        method: 'POST',
        data: exercise,
      }),
      // Pas besoin d'invalidate ici : on met directement à jour la liste
      async onQueryStarted({ sportId }, { dispatch, queryFulfilled }) {
        try {
          const { data: exerciseList } = await queryFulfilled;
          // Remplace entièrement le cache de getSports par la nouvelle liste
          dispatch(
            exerciseApi.util.updateQueryData(
              'getExercises',
              { sportId },
              () => exerciseList,
            ),
          );
        } catch (error) {
          console.error("Erreur lors de la création de l'exercise", error);
        }
      },
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useUpdateExerciseMutation,
  useCreateExerciseMutation,
} = exerciseApi;
