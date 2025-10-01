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
import { SessionExerciseDetail } from './SessionExerciseDetail';
import { getAllSetsBySessionId } from '../set/setSlice';
import { ExerciseDrawer } from '../exercise/ExerciseDrawer';
import type { Exercise } from '../exercise/exerciseApi';

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

export const OngoingSession: React.FC = () => {
  const session = useAppSelector(selectSession);
  const sessionExercises = useAppSelector(selectSessionExercises);
  const sessionSliceState = useAppSelector(selectSessionState);
  const dispatch = useAppDispatch();
  const { sessionId } = useParams();
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isFinishedSession, setIsFinishedSession] = useState(true);

  const displayContentDrawer = (exercise: Exercise | null) => {
    console.log('---azazd');
    setIsContentDrawerOpen(true);
    setSelectedExercise(exercise);
  };

  const closeContentDrawer = () => {
    setIsContentDrawerOpen(false);
    setTimeout(() => {
      setSelectedExercise(null);
    }, 200);
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

  console.log('---is Finished', isFinishedSession);
  useEffect(() => {
    if (sessionId) {
      dispatch(getSession(+sessionId));
      dispatch(getSessionExercises(+sessionId));
      dispatch(getAllSetsBySessionId(+sessionId));
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionSliceState === SliceState.FINISHED && !session) {
      console.log('session error');
      // todo redirect and display message
    }
  }, [sessionSliceState]);

  useEffect(() => {
    setIsFinishedSession(Boolean(session?.endDate));
  }, [session]);

  return (
    <>
      <PageLayout
        title={displayTitle()}
        isLoading={sessionSliceState !== SliceState.FINISHED}
      >
        {session &&
          sessionExercises?.map(sessionExercise => (
            <SessionExerciseDetail
              key={sessionExercise.id}
              sessionExercise={sessionExercise}
              sessionId={session.id}
              onDisplayExerciseDetail={() =>
                displayContentDrawer(sessionExercise.exercise)
              }
              disabled={isFinishedSession}
            />
          ))}
      </PageLayout>
      <ExerciseDrawer
        isOpen={isContentDrawerOpen}
        onClose={closeContentDrawer}
        exercise={selectedExercise}
      />
    </>
  );
};
