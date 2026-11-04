import { Box, Container, styled, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  getAllSession,
  selectAllSession,
  selectIsLoading,
} from './sessionSlice';
import { useEffect } from 'react';
import { PageLayout } from '../../components/PageLayout';
import { ExercisesLine, SessionItem } from '../../components/session';
import type { Session } from './types';
import { useNavigate } from 'react-router-dom';
import { MainActionButton } from '../../components/MainActionButton';
import { useTranslation } from 'react-i18next';
import { GenericChip } from '../../components/GenericChip';

const SessionsContainer = styled(Container)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  padding-inline: 1rem;
`;

const InfoLine = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const SessionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectAllSession);
  const isLoading = useAppSelector(selectIsLoading);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const goToSession = (sessionId: Session['id']) => {
    navigate(`/sessions/${sessionId}`);
  };

  const goToNewSession = () => {
    navigate(`/sessions/new`);
  };

  const displaySessions = () => {
    if (sessions.length) {
      return sessions.map(session => (
        <SessionItem onClick={() => goToSession(session.id)} key={session.id}>
          <InfoLine>
            <Typography color="text.secondary">
              {new Date(session.startDate).toLocaleDateString()}
            </Typography>
            <GenericChip
              color={session.endDate ? 'primary' : 'secondary'}
              label={
                session.endDate ? t('sessions.finished') : t('sessions.ongoing')
              }
            />
          </InfoLine>
          <Typography variant="h6"> {session.name}</Typography>
          <Typography color="text.secondary">{session.sport.name}</Typography>
          <ExercisesLine sessionExercises={session.sessionExercises} />
        </SessionItem>
      ));
    } else {
      return <Typography>{t('sessions.noSession')}</Typography>;
    }
  };

  useEffect(() => {
    dispatch(getAllSession());
  }, [dispatch]);

  return (
    <PageLayout title={t('sessions.title')} isLoading={isLoading}>
      <SessionsContainer>{displaySessions()}</SessionsContainer>
      <MainActionButton onClick={goToNewSession} />
    </PageLayout>
  );
};
