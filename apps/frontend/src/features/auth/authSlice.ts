import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthenticatedUser } from './authApi';
import type { RootState } from '../../utils/store';

interface AuthState {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: AuthState['accessToken'];
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
    },
    setAuthenticatedUser: (
      state,
      action: PayloadAction<{
        user: AuthState['user'];
      }>,
    ) => {
      state.user = action.payload.user;
    },
    // logout: state => {
    //   state.accessToken = null;
    //   state.user = null;
    // },
  },
});

export const { setAccessToken, setAuthenticatedUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
