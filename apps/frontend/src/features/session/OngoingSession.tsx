import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  getSession,
  getSessionExercises,
  selectSession,
  selectSessionExercises,
  selectSessionState,
  updateSession,
} from './sessionSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SliceState } from '../../utils/common';
import { PageLayout } from '../../components/PageLayout';
import { SessionExerciseDetail } from './SessionExerciseDetail';
import { getAllSetsBySessionId } from '../set/setSlice';
import { ExerciseDrawer } from '../exercise/ExerciseDrawer';
import type { Exercise } from '../exercise/exerciseApi';
import { MainActionButton } from '../../components/MainActionButton';
import { DoneAllOutlined, Edit } from '@mui/icons-material';
import { Box, styled, Typography } from '@mui/material';
import type { Session } from './types';
import { formatDuration, intervalToDuration } from 'date-fns';
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

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 1rem;
  padding-left: 2rem;
`;

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
    setIsContentDrawerOpen(true);
    setSelectedExercise(exercise);
  };

  const closeContentDrawer = () => {
    setIsContentDrawerOpen(false);
    setTimeout(() => {
      setSelectedExercise(null);
    }, 200);
  };

  const endOrEditSession = () => {
    if (session) {
      dispatch(
        updateSession({
          sessionId: session.id,
          endDate: session.endDate ? undefined : new Date(),
        }),
      );
    }
  };

  const displaySessionDuration = (
    sessionStartDate: Session['startDate'],
    sessionEndDate: Session['endDate'],
  ) => {
    const duration = intervalToDuration({
      start: sessionStartDate,
      end: sessionEndDate,
    });
    return <Typography>Durée : {formatDuration(duration)}</Typography>;
  };

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
        title={session?.sport.name}
        subtitle={session?.name}
        isLoading={sessionSliceState !== SliceState.FINISHED}
      >
        <StyledBox>
          {session?.endDate
            ? displaySessionDuration(session.startDate, session.endDate)
            : null}
        </StyledBox>
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
        <MainActionButton
          onClick={endOrEditSession}
          icon={
            session?.endDate ? (
              <Edit fontSize="large" />
            ) : (
              <DoneAllOutlined fontSize="large" />
            )
          }
        />
      </PageLayout>
      <ExerciseDrawer
        isOpen={isContentDrawerOpen}
        onClose={closeContentDrawer}
        exercise={selectedExercise}
      />
    </>
  );
};
