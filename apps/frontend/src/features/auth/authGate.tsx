import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import { useRefreshTokenMutation } from './authApi';
import { setAccessToken, setAuthenticatedUser } from './authSlice';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken } = useAppSelector(state => state.auth);
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();

  useEffect(() => {
    refreshToken()
      .unwrap()
      .then(data => {
        dispatch(setAccessToken({ accessToken: data.accessToken }));
        dispatch(setAuthenticatedUser({ user: data.user }));
        if (data.accessToken) navigate('/');
        else navigate('/login');
      })
      .catch(() => {
        dispatch(setAccessToken({ accessToken: null }));
        dispatch(setAuthenticatedUser({ user: null }));
        navigate('/login');
      });
  }, [refreshToken, dispatch, navigate]);

  useEffect(() => {
    if (!isLoading) {
      if (accessToken) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [accessToken, isLoading, navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}
