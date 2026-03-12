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
  Autocomplete,
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import type { Session } from './types';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { GenericMenu, type MenuItem } from '../../components/menu/GenericMenu';
import { GenericModal } from '../../components/GenericModal';
import { GenericDatePicker } from '../../components/GenericDatePicker';
import dayjs from 'dayjs';
import { StyledTextField } from '../../components/form/FormTextField';
import { FIELD_SIZE, FIELD_WIDTH_KEY } from '../../components/form/constants';
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
  const [sessionName, setSessionName] = useState<Session['name']>(
    session?.name ?? '',
  );
  const [isEditSessionName, setIsEditSessionName] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] =
    useState(false);

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

  const updateOngoingSession = (sessionPartToUpdate: Partial<Session>) => {
    if (session) {
      dispatch(
        updateSession({ sessionId: session.id, ...sessionPartToUpdate }),
      );
    }
  };

  const editSessionName = (name: Session['name']) => {
    updateOngoingSession({ name });
    setIsEditSessionName(!isEditSessionName);
  };

  const displaySessionName = () => {
    if (session?.isFinished) {
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
            <IconButton onClick={() => editSessionName(sessionName)}>
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
    if (session?.isFinished && sessionEndDate) {
      const duration = intervalToDuration({
        start: sessionStartDate,
        end: sessionEndDate,
      });
      return (
        <StyledBox>
          <Typography>{`Date: ${format(sessionStartDate, 'dd/MM/y', {})}`}</Typography>
          <Typography>
            {`Durée: ${formatDuration(duration, { format: ['hours', 'minutes'] })}`}
          </Typography>
        </StyledBox>
      );
    } else {
      return (
        <DateContainer>
          <GenericDatePicker
            value={dayjs(sessionStartDate)}
            onChange={value => {
              if (value) {
                updateOngoingSession({ startDate: value.toDate() });
              }
            }}
            label={t('sessions.startDate')}
          />
          <GenericDatePicker
            value={session?.endDate ? dayjs(session.endDate) : null}
            onChange={value => {
              if (value) {
                updateOngoingSession({ endDate: value.toDate() });
              }
            }}
            label={t('sessions.endDate')}
            minDate={dayjs(sessionStartDate)}
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
        value: exercise.id as number,
        label: exercise.name,
      }));

      return (
        <Autocomplete
          options={exercisesItems}
          onChange={(_, value) => {
            dispatch(
              createSessionExercise({
                sessionId: session.id,
                exerciseId: value?.value,
              }),
            );
            setIsAddingExercise(false);
          }}
          onBlur={() => setIsAddingExercise(false)}
          getOptionLabel={option => option.label}
          renderInput={params => (
            <StyledTextField
              {...params}
              variant="outlined"
              label={t('sessions.addSessionExercise')}
              size={FIELD_SIZE.MEDIUM}
              width={FIELD_WIDTH_KEY.LARGE}
            />
          )}
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
              disabled={session.isFinished}
            />
          ))}
        {!session?.isFinished && (
          <AddExerciseContainer>{displayAddExercise()}</AddExerciseContainer>
        )}
        <MainActionButton
          onClick={() => {
            console.log('putain', !session?.isFinished);
            updateOngoingSession({ isFinished: !session?.isFinished });
          }}
          icon={
            session?.isFinished ? (
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
