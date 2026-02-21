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
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { GenericSelect } from '../../components/GenericSelect';
import { useTranslation } from 'react-i18next';
import { GenericMenu, type MenuItem } from '../../components/menu/GenericMenu';
import { GenericModal } from '../../components/GenericModal';
import { GenericDatePicker } from '../../components/GenericDatePicker';
import dayjs from 'dayjs';
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

const DateContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding-inline: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`;

export const OngoingSession: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const session = useAppSelector(selectSession);
  const sessionExercises = useAppSelector(selectSessionExercises);
  const sessionSliceState = useAppSelector(selectSessionState);

  const { sessionId } = useParams();
  const [sessionName, setSessionName] = useState('');
  const [isEditSessionName, setIsEditSessionName] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isFinishedSession, setIsFinishedSession] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] =
    useState(false);
  const [startDate, setStartDate] = useState<Date>(
    session?.startDate ?? dayjs().toDate(),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    session?.endDate ?? null, // maj
  );

  const { data: exercises = [] } = useGetExercisesQuery({
    sportId: session?.sport?.id,
  });

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
    // TODO nae, il faut un formulaire pour les dates et le nom de la session
    if (session) {
      dispatch(
        updateSession({
          sessionId: session.id,
          startDate: startDate,
          endDate: endDate ?? dayjs().toDate(),
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
              label={t('sessions.sessionName')}
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

  const displaySessionDateInfo = (
    sessionStartDate: Session['startDate'],
    sessionEndDate: Session['endDate'],
  ) => {
    if (isFinishedSession) {
      const duration = intervalToDuration({
        start: sessionStartDate,
        end: sessionEndDate,
      });
      return (
        <StyledBox>
          <Typography>{`Date: ${format(startDate, 'dd/MM/y', {})}`}</Typography>
          <Typography>
            {`Durée: ${formatDuration(duration, { format: ['hours', 'minutes'] })}`}
          </Typography>
        </StyledBox>
      );
    } else {
      return (
        <DateContainer>
          <GenericDatePicker
            value={dayjs(startDate)}
            onChange={value => {
              console.log('-----');
              console.log(value);
              if (value) {
                setStartDate(value.toDate());
              }
            }}
            label={t('sessions.startDate')}
            // size="small"
          />
          <GenericDatePicker
            value={endDate ? dayjs(endDate) : null}
            onChange={value => {
              console.log(value);
              if (value) {
                setEndDate(value.toDate());
              }
            }}
            label={t('sessions.endDate')}
            // size="small"
          />
        </DateContainer>
      );
    }
  };

  const displayAddExercise = () => {
    // todo commmon exercise picker ?
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
        {session
          ? displaySessionDateInfo(session.startDate, session.endDate)
          : null}
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
