import { Box, Container, styled, Typography } from '@mui/material';
import { useAppSelector } from '../../utils/store';
import { selectUser } from '../auth/authSlice';
import { PageLayout } from '../../components/PageLayout';
import {
  ExercisesLine,
  OngoingChip,
  SessionItem,
} from '../../components/session';
import { useTranslation } from 'react-i18next';
import { useGetForDashboardQuery } from './dashboardApi';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../session/types';

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

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetForDashboardQuery();

  const goToSession = (sessionId: Session['id']) => {
    navigate(`/sessions/${sessionId}`);
  };

  return (
    <PageLayout title={`${t('dashboard.welcome')} ${user?.firstname} !`}>
      <SessionsContainer>
        {isLoading && (
          <Typography variant="body1">{t('common.loading')}</Typography>
        )}
        {error ? (
          <Typography variant="body1" color="error">
            {t('common.error')}
          </Typography>
        ) : null}
        {data && (
          <>
            <Typography variant="h6">
              {data.lastTenDaysSessionsNumber
                ? t('dashboard.sessionsLastTenDays', {
                    count: data.lastTenDaysSessionsNumber,
                  })
                : null}
            </Typography>
            {data.lastSessions.length > 0 ? (
              data.lastSessions.map(session => (
                <SessionItem
                  onClick={() => goToSession(session.id)}
                  key={session.id}
                >
                  <InfoLine>
                    <Typography>
                      {new Date(session.startDate).toLocaleDateString()}
                    </Typography>
                    {!session.endDate && <OngoingChip />}
                  </InfoLine>
                  <Typography variant="h6">{session.sport?.name}</Typography>
                  <Typography>{session.name}</Typography>
                  <ExercisesLine sessionExercises={session.sessionExercises} />
                </SessionItem>
              ))
            ) : (
              <Typography>{t('sessions.noSessionsForTheLastDays')}</Typography>
            )}
          </>
        )}
      </SessionsContainer>
    </PageLayout>
  );
};
