import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  getSession,
  getSessionExercises,
  selectSession,
  selectSessionExercises,
  selectSessionState,
} from './sessionSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SliceState } from '../../utils/common';
import { PageLayout } from '../../components/PageLayout';

// const ExercisesContainer = styled(Container)`
//   flex: 1 1 auto;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   min-height: 0;
// `;

// POURQUOI MIN HEIGHT 0
// Dans un parent flex en colonne, si le dernier enfant a height: auto par défaut, il peut dépasser le parent.
// Flexbox en colonne requiert min-height: 0 sur le container pour que flex: 1 fonctionne comme prévu.
// Sans ça, le navigateur calcule la hauteur comme “au moins le contenu”, et le parent dépasse 100vh.

// interface IExerciseList {
//   exercises: Exercise[];
//   displayModal: (exercise: Exercise) => void;
// }

export const Session: React.FC = () => {
  const session = useAppSelector(selectSession);
  const sessionExecises = useAppSelector(selectSessionExercises);
  const sessionSliceState = useAppSelector(selectSessionState);
  const dispatch = useAppDispatch();
  const { sessionId } = useParams();
  const [isOngoingSession, setIsOngoingSession] = useState(false);

  const displaySessionExercises = () => {
    if (sessionExecises.length) {
      return sessionExecises.map(sessionExercise => (
        <Typography>{sessionExercise.exercise.name}</Typography>
      ));
    }
  };

  const displayTitle = () => {
    if (!session) {
      return 'Session';
    } else if (session.endDate) {
      return `${session.name} : Session ${session.sport.name} du ${session.startDate}`;
    } else {
      return `${session.name} : Session ${session.sport.name} en cours`;
    }
  };

  useEffect(() => {
    if (sessionId) {
      dispatch(getSession(+sessionId));
      dispatch(getSessionExercises(+sessionId));
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionSliceState === SliceState.FINISHED && !session) {
      console.log('session error');
      // todo redirect and display message
    }
  }, [sessionSliceState]);

  useEffect(() => {
    setIsOngoingSession(Boolean(session?.endDate));
  }, [session]);

  return (
    <PageLayout
      title={displayTitle()}
      isLoading={sessionSliceState !== SliceState.FINISHED}
    >
      {displaySessionExercises()}
    </PageLayout>
  );
};
