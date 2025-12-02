import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  createSessionExercise,
  deleteSession,
  getSession,
  getSessionExercises,
  selectSession,
  selectSessionExercises,
  selectSessionState,
  updateSession,
} from './sessionSlice';
import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SliceState } from '../../utils/common';
import { PageLayout } from '../../components/PageLayout';
import { SessionExerciseDetail } from './SessionExerciseDetail';
import { getAllSetsBySessionId } from '../set/setSlice';
import { ExerciseDrawer } from '../exercise/ExerciseDrawer';
import { useGetExercisesQuery, type Exercise } from '../exercise/exerciseApi';
import { MainActionButton } from '../../components/MainActionButton';
import { DoneAllOutlined, Edit, MoreVert, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import type { Session } from './types';
import { formatDuration, intervalToDuration } from 'date-fns';
import { GenericSelect } from '../../components/GenericSelect';
import { useTranslation } from 'react-i18next';
import { GenericMenu, type MenuItem } from '../../components/menu/GenericMenu';
import { GenericModal } from '../../components/GenericModal';
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

const EditableSessionName = styled(Box)`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1rem;
`;

const AddExerciseContainer = styled(Box)`
  margin-top: 1rem;
  margin-left: 0.5rem;
  align-self: flex-start;
  width: fit-content;
`;

export const OngoingSession: React.FC = () => {
  const { t } = useTranslation();
  const session = useAppSelector(selectSession);
  const sessionExercises = useAppSelector(selectSessionExercises);
  const sessionSliceState = useAppSelector(selectSessionState);
  const dispatch = useAppDispatch();
  const { sessionId } = useParams();
  const [sessionName, setSessionName] = useState('');
  const [isEditSessionName, setIsEditSessionName] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isFinishedSession, setIsFinishedSession] = useState(true);
  const { data: exercises = [] } = useGetExercisesQuery({
    sportId: session?.sport?.id,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] =
    useState(false);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: t('sessions.updateLabel'),
        action: () => setIsEditSessionName(true),
      },
      {
        label: t('sessions.deleteSession'),
        action: () => setIsDeleteSessionModalOpen(true),
      },
    ],
    [],
  );

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

  const saveSessionName = () => {
    if (session) {
      if (isEditSessionName) {
        dispatch(
          updateSession({
            sessionId: session.id,
            name: sessionName,
          }),
        );
      }
      setIsEditSessionName(!isEditSessionName);
    }
  };

  const displaySessionName = () => {
    if (isFinishedSession) {
      return sessionName;
    } else {
      return (
        <EditableSessionName>
          {isEditSessionName ? (
            <TextField
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              label="Nom de la séance"
            />
          ) : (
            <Typography variant="h4">{sessionName}</Typography>
          )}
          {isEditSessionName && (
            <IconButton onClick={saveSessionName}>
              <Save />
            </IconButton>
          )}
        </EditableSessionName>
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

  const displayAddExercise = () => {
    const exerciseList = exercises.filter(
      exercise =>
        !sessionExercises.find(
          sessionExercise => sessionExercise.exercise.id === exercise.id,
        ),
    );

    if (session && isAddingExercise && exerciseList.length) {
      const exercisesItems = exerciseList.map(exercise => ({
        value: exercise.id,
        label: exercise.name,
      }));

      return (
        <GenericSelect
          items={exercisesItems}
          label={t('sessions.addSessionExercise')}
          onChange={e => {
            dispatch(
              createSessionExercise({
                sessionId: session.id,
                exerciseId: e.target.value,
              }),
            );
            setIsAddingExercise(false);
          }}
          handleOnBlur={() => setIsAddingExercise(false)}
        />
      );
    } else if (session && !isAddingExercise && exerciseList.length) {
      return (
        <Button variant="contained" onClick={() => setIsAddingExercise(true)}>
          {t('sessions.addSessionExercise')}
        </Button>
      );
    } else {
      return null;
    }
  };

  const onSessionDelete = async () => {
    if (session?.id) {
      await dispatch(deleteSession(session?.id));
      navigate('/sessions');
    }
  };

  const openMenu = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (sessionId) {
      dispatch(getSession(+sessionId));
      dispatch(getSessionExercises(+sessionId));
      dispatch(getAllSetsBySessionId(+sessionId));
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (session) {
      setSessionName(session.name);
    }
  }, [session, dispatch]);

  useEffect(() => {
    if (sessionSliceState === SliceState.FINISHED && !session) {
      console.log('session error');
      // todo redirect and display message
    }
  }, [sessionSliceState, session]);

  useEffect(() => {
    setIsFinishedSession(Boolean(session?.endDate));
  }, [session]);

  return (
    <>
      <PageLayout
        title={session?.sport.name}
        subtitle={displaySessionName()}
        isLoading={sessionSliceState !== SliceState.FINISHED}
        titleMenuButton={
          <IconButton onClick={openMenu}>
            <MoreVert />
          </IconButton>
        }
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
        {!isFinishedSession && (
          <AddExerciseContainer>{displayAddExercise()}</AddExerciseContainer>
        )}
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
      <GenericMenu
        id="session-menu"
        anchor={anchorEl}
        handleClose={handleClose}
        menuItems={menuItems}
      />
      <GenericModal
        open={isDeleteSessionModalOpen}
        handleClose={() => setIsDeleteSessionModalOpen(false)}
        handleConfirm={onSessionDelete}
        title={t('sessions.deleteSession')}
        children={<Typography>{t('sessions.deleteSessionText')}</Typography>}
      />
    </>
  );
};
