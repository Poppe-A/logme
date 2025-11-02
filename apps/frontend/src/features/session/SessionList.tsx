import {
  Box,
  Chip,
  Container,
  styled,
  Typography,
  type Theme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  getAllSession,
  selectAllSession,
  selectIsLoading,
} from './sessionSlice';
import { useEffect } from 'react';
import { PageLayout } from '../../components/PageLayout';
import type { Session } from './types';
import { useNavigate } from 'react-router-dom';
import { MainActionButton } from '../../components/MainActionButton';
import { useTranslation } from 'react-i18next';

const SessionsContainer = styled(Container)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  padding-inline: 1rem;
`;

// POURQUOI MIN HEIGHT 0
// Dans un parent flex en colonne, si le dernier enfant a height: auto par défaut, il peut dépasser le parent.
// Flexbox en colonne requiert min-height: 0 sur le container pour que flex: 1 fonctionne comme prévu.
// Sans ça, le navigateur calcule la hauteur comme “au moins le contenu”, et le parent dépasse 100vh.

// interface IExerciseList {
//   exercises: Exercise[];
//   displayModal: (exercise: Exercise) => void;
// }

const SessionItem = styled(Container)<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  padding: '1rem',
  gap: '0.5rem',
  cursor: 'pointer',
  backgroundColor: theme?.palette.background.card, // Couleur personnalisée définie dans le thème
  overflow: 'hidden',
}));

const SessionDescription = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const ExercisesLine = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  overflow-x: scroll;
`;

const OngoingChip = styled(Chip)`
  margin-left: auto;
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
          <SessionDescription>
            <Typography variant="h6">{session.sport.name}</Typography>
            {!session.endDate && (
              <OngoingChip label={t('sessions.ongoing')} color="secondary" />
            )}
          </SessionDescription>
          {/* <SessionDescription> */}
          <Typography>{session.name}</Typography>
          <Typography>
            {new Date(session.startDate).toLocaleDateString()}
          </Typography>
          {/* </SessionDescription> */}
          <ExercisesLine>
            {session.sessionExercises?.map(sessionExercise => (
              <Chip
                key={sessionExercise.id}
                label={sessionExercise.exercise.name}
                size="small"
              />
            ))}
          </ExercisesLine>
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
