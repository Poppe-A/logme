// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sessionReducer from '../features/session/sessionSlice';
import setReducer from '../features/set/setSlice';
import { authApi } from '../features/auth/authApi';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import { sportApi } from '../features/sport/sportApi';
import { exerciseApi } from '../features/exercise/exerciseApi';
import { createApiClient } from './axiosInstance';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    set: setReducer,
    [authApi.reducerPath]: authApi.reducer,
    [sportApi.reducerPath]: sportApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      sportApi.middleware,
      exerciseApi.middleware,
    ),
});

// Types utiles pour RTK Query & axiosBaseQuery
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

createApiClient('http://localhost:3000/api/v1', store.getState, store.dispatch);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
