import {
  Button,
  Card,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useLoginMutation } from './authApi';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const LoginPageContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FormCard = styled(Card)`
  padding: 1rem;
`;

const FormContainer = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export function LoginPage() {
  const { t } = useTranslation();
  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // todo faire un meilleur form avec validation de donnée
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <LoginPageContainer>
      <FormCard elevation={2}>
        <FormContainer onSubmit={handleSubmit}>
          <Typography variant="h2" color="primary">
            {t('auth.login')}
          </Typography>
          <TextField
            label={t('auth.email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('auth.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" type="submit">
              {t('common.confirm')}
            </Button>
          )}
          {Boolean(error) && <Typography>{t('auth.loginError')}</Typography>}
        </FormContainer>
      </FormCard>
    </LoginPageContainer>
  );
}
