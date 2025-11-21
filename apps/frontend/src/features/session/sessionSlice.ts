import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  CreateSessionDto,
  CreateSessionExerciseDto,
  Session,
  SessionExercise,
  UpdateSessionDto,
  UpdateSessionExerciseCommentDto,
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
  async ({ sessionId, endDate, exercises, description, name }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.patch<Session>(
        `/sessions/${sessionId}`,
        {
          endDate,
          exercises,
          description,
          name,
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
      `/sessions/${sessionId}/session-exercises`,
    );

    return response;
  } catch (err: unknown) {
    const error = err as AxiosError;
    throw Error(error.message);
  }
});

export const createSessionExercise = createAsyncThunk<
  SessionExercise,
  CreateSessionExerciseDto
>('session/create-session-exercise', async createSessionExerciseDto => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post<SessionExercise>(
      `/sessions/${createSessionExerciseDto.sessionId}/session-exercises`,
      {
        session: { id: createSessionExerciseDto.sessionId },
        exercise: { id: createSessionExerciseDto.exerciseId },
      },
    );

    return response;
  } catch (err: unknown) {
    const error = err as AxiosError;
    throw Error(error.message);
  }
});

export const updateSessionExerciseComment = createAsyncThunk<
  SessionExercise,
  UpdateSessionExerciseCommentDto
>(
  'session/update-session-exercise-comment',
  async ({ id, sessionId, comment }) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.patch<SessionExercise>(
        `/sessions/${sessionId}/session-exercises/${id}/comment`,
        { comment },
      );

      return response;
    } catch (err: unknown) {
      const error = err as AxiosError;
      throw Error(error.message);
    }
  },
);

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
      })
      .addCase(createSessionExercise.pending, state => {
        state.isLoading = true;
      })
      .addCase(createSessionExercise.fulfilled, (state, action) => {
        if (action.payload) {
          state.sessionExercises = [...state.sessionExercises, action.payload];
        }
        state.isLoading = false;
      })
      .addCase(createSessionExercise.rejected, state => {
        state.isLoading = false;
      })
      .addCase(updateSessionExerciseComment.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateSessionExerciseComment.fulfilled, (state, action) => {
        state.sessionExercises = state.sessionExercises.map(sessionExercise =>
          sessionExercise.id === action.payload.id
            ? action.payload
            : sessionExercise,
        );
        state.isLoading = false;
      })
      .addCase(updateSessionExerciseComment.rejected, state => {
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
