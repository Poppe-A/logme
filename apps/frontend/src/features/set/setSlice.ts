import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import type { DeleteSetDto, Set, UpsertSetDto } from './types';
import type { RootState } from '../../utils/store';
import type { Session, SessionExercise } from '../session/types';
import { getApiClient } from '../../utils/axiosInstance';
import type { AxiosError } from 'axios';

export const getAllSetsBySessionId = createAsyncThunk<Set[], Session['id']>(
  'sets/all-sets-by-session-id',
  async sessionId => {
    console.log('--- get sets');
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get<Set[]>(
        `/sessions/${sessionId}/sets`,
      );

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const createSet = createAsyncThunk<Set, UpsertSetDto>(
  'sets/create',
  async ({ data, sessionId, sessionExerciseId }) => {
    console.log('--- create sets');
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post<Set>(
        `/sessions/${sessionId}/session-exercises/${sessionExerciseId}/sets`,
        data,
      );

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const updateSet = createAsyncThunk<Set, UpsertSetDto>(
  'sets/update',
  async ({ data, sessionId, id, sessionExerciseId }) => {
    console.log('--- update sets');
    try {
      const apiClient = getApiClient();
      const response = await apiClient.patch<Set>(
        `/sessions/${sessionId}/session-exercises/${sessionExerciseId}/sets/${id}`,
        data,
      );
      console.log('--- res', response);
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const deleteSet = createAsyncThunk<Set['id'], DeleteSetDto>(
  'sets/delete',
  async ({ sessionId, id, sessionExerciseId }) => {
    console.log('--- update sets');
    try {
      const apiClient = getApiClient();
      const response = await apiClient.delete<Set['id']>(
        `/sessions/${sessionId}/session-exercises/${sessionExerciseId}/sets/${id}`,
      );
      console.log('--- res', response);
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

const setsAdapter = createEntityAdapter({
  selectId: (set: Set) => set.id,
  sortComparer: (a, b) => a.id - b.id,
});

const setSlice = createSlice({
  name: 'set',
  initialState: setsAdapter.getInitialState(),
  reducers: {
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
    setAdded: setsAdapter.addOne,
    setUpdated: setsAdapter.updateOne,
    setDeleted: setsAdapter.removeOne,
    setsReceived(state, action) {
      // Or, call them as "mutating" helpers in a case reducer
      setsAdapter.setAll(state, action.payload.sets);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllSetsBySessionId.fulfilled, (state, action) => {
        setsAdapter.setAll(state, action.payload);
      })
      .addCase(updateSet.fulfilled, (state, action) => {
        setsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(createSet.fulfilled, (state, action) => {
        setsAdapter.addOne(state, action.payload);
      })
      .addCase(deleteSet.fulfilled, (state, action) => {
        setsAdapter.removeOne(state, action.payload);
      });
  },
});

// { ids: [], entities: {} }

export const {
  selectAll: selectAllSets,
  selectById: selectSetById,
  selectIds: selectSetIds,
} = setsAdapter.getSelectors((state: RootState) => state.set);

export const selectSetsBySessionExerciseId = (
  state: RootState,
  sessionExerciseId: SessionExercise['id'],
) =>
  selectAllSets(state).filter(
    set => set.sessionExercise.id === sessionExerciseId,
  );

export default setSlice.reducer;
