import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  CreateSessionDto,
  Session,
  SessionExercise,
  UpdateSessionDto,
} from './types';
import { getApiClient } from '../../utils/axiosInstance';
import type { AxiosError } from 'axios';
import type { RootState } from '../../utils/store';
import { SliceState } from '../../utils/common';

interface SessionState {
  session: Session | null;
  currentSessionState: SliceState;
  sessions: Session[];
  sessionExercises: SessionExercise[];
  isLoading: boolean;
}

const initialState: SessionState = {
  session: null,
  currentSessionState: SliceState.IDLE,
  sessions: [],
  sessionExercises: [],
  isLoading: false,
};

export const createSessionWithExercises = createAsyncThunk<
  Session['id'],
  CreateSessionDto
>('session/create-session-with-exercises', async createSessionDto => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post<Session['id']>(
      '/sessions',
      createSessionDto,
    );

    return response;
  } catch (err: unknown) {
    const error = err as AxiosError;
    throw Error(error.message);
  }
});

export const getCurrentSession = createAsyncThunk<Session, void>(
  'session/current-session',
  async () => {
    try {
      // chercher par sport pour afficher un message si session en cours d'un certain sport
      const apiClient = getApiClient();
      const response = await apiClient.get<Session>('/sessions/current');

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const getAllSession = createAsyncThunk<Session[], void>(
  'session/all-session',
  async () => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get<Session[]>('/sessions');

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const getSession = createAsyncThunk<Session, Session['id']>(
  'session/session',
  async sessionId => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.get<Session>(`/sessions/${sessionId}`);

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const updateSession = createAsyncThunk<Session, UpdateSessionDto>(
  'session/update',
  async ({ sessionId, endDate, exercises, description }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.patch<Session>(
        `/sessions/${sessionId}`,
        {
          endDate,
          exercises,
          description,
        },
      );

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

export const getSessionExercises = createAsyncThunk<
  SessionExercise[],
  Session['id']
>('session/session-exercises', async sessionId => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get<SessionExercise[]>(
      `/sessions/${sessionId}/exercises`,
    );

    return response;
  } catch (err: unknown) {
    const error = err as AxiosError;
    throw Error(error.message);
  }
});

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    resetCurrentSession: state => {
      state.session = null;
      state.currentSessionState = SliceState.IDLE;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createSessionWithExercises.pending, state => {
        state.isLoading = true;
      })
      .addCase(createSessionWithExercises.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createSessionWithExercises.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getSession.pending, state => {
        state.session = null;
        state.currentSessionState = SliceState.LOADING;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.session = action.payload;

        state.currentSessionState = SliceState.FINISHED;
      })
      .addCase(getSession.rejected, state => {
        state.currentSessionState = SliceState.FINISHED;
      })
      .addCase(getAllSession.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllSession.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllSession.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getSessionExercises.pending, state => {
        state.isLoading = true;
      })
      .addCase(getSessionExercises.fulfilled, (state, action) => {
        state.sessionExercises = action.payload;
        state.isLoading = false;
      })
      .addCase(getSessionExercises.rejected, state => {
        state.isLoading = false;
      })
      .addCase(updateSession.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.isLoading = false;
      })
      .addCase(updateSession.rejected, state => {
        // à voir
        state.isLoading = false;
      });
  },
});

export default sessionSlice.reducer;
export const selectIsLoading = (state: RootState) => state.session.isLoading;
export const selectSession = (state: RootState) => state.session.session;
export const selectSessionState = (state: RootState) =>
  state.session.currentSessionState;
export const selectAllSession = (state: RootState) => state.session.sessions;
export const selectSessionExercises = (state: RootState) =>
  state.session.sessionExercises;
