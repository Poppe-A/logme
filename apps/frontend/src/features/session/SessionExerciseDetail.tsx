import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  styled,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FormSet, FormValue, Session, SessionExercise } from './types';
import { useAppDispatch, useAppSelector } from '../../utils/store';
import {
  createSet,
  deleteSet,
  selectSetsBySessionExerciseId,
  updateSet,
} from '../set/setSlice';
import {
  useFieldArray,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import type { Set, UpsertSetDto } from '../set/types';
import { SetRow } from './SetRow';
import { InfoOutline } from '@mui/icons-material';
import { useEffect, type MouseEvent } from 'react';

const SetsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccordionSummaryContent = styled(Box)`
  display: flex;
  gap: 1rem;
  align-items: center;
  align-self: flex-start;
`;

interface ISessionExerciseDetail {
  sessionExercise: SessionExercise;
  sessionId: Session['id'];
  onDisplayExerciseDetail: () => void;
  disabled?: boolean;
}

export const SessionExerciseDetail: React.FC<ISessionExerciseDetail> = ({
  sessionExercise,
  sessionId,
  onDisplayExerciseDetail,
  disabled,
}) => {
  const dispatch = useAppDispatch();
  const sets = useAppSelector(store =>
    selectSetsBySessionExerciseId(store, sessionExercise.id),
  );
  const formatDataToFormSet = (sets: Set[]): FormSet[] => {
    return sets.map(set => ({
      id: set.id,
      repetitions: set.repetitions,
      weight: set.weight,
    }));
  };

  const {
    control,
    handleSubmit,

    formState: { isDirty },
  } = useForm<FormValue>({
    values: {
      sets: formatDataToFormSet(sets),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sets',
    keyName: sessionExercise.exercise.name,
  });

  const addEmptySet = () => {
    append({ repetitions: 0, weight: 0 });
  };

  const onDeleteSet = (index: number, setId?: Set['id']) => {
    if (!setId) {
      remove(index);
    } else {
      dispatch(
        deleteSet({
          id: setId,
          sessionId,
          sessionExerciseId: sessionExercise.id,
        }),
      );
    }
  };

  const onSubmit: SubmitHandler<FormValue> = data => {
    const updateFieldsPromises = [];

    data.sets.forEach((field, index) => {
      const storeSet = sets[index];

      const setToUpsert: UpsertSetDto = {
        data: {
          repetitions: field.repetitions ? field.repetitions : 0,
          weight: field.weight ? field.weight : 0,
        },
        id: field.id,
        sessionId: sessionId,
        sessionExerciseId: sessionExercise.id,
      };

      if (
        field.id &&
        (field.repetitions !== storeSet.repetitions ||
          field.weight !== storeSet.weight)
      ) {
        updateFieldsPromises.push(dispatch(updateSet(setToUpsert)));
      } else if (!field.id) {
        updateFieldsPromises.push(dispatch(createSet(setToUpsert)));
      }
    });
  };

  const displayExerciseDetails = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDisplayExerciseDetail();
  };

  const onError: SubmitErrorHandler<FormValue> = data => {
    console.log('error', data);
  };

  // useEffect(() => {
  //   console.log('--- addNewLine');
  //   if (!fields.length) {
  //     addEmptySet();
  //   }
  // }, [fields.length]);

  // todo modale to display exercises infos
  // memoize selector
  // previous results
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <AccordionSummaryContent>
          <Typography variant="h5">{sessionExercise.exercise.name}</Typography>
          <Box component="span" onClick={displayExerciseDetails}>
            <InfoOutline fontSize="medium" />
          </Box>
        </AccordionSummaryContent>
      </AccordionSummary>
      <AccordionDetails>
        <SetsContainer>
          {fields.length ? (
            fields.map((field, index) => (
              <SetRow
                control={control}
                index={index}
                onDelete={() => onDeleteSet(index, field?.id)}
                disabled={disabled}
                key={field?.id ?? 'newLine'}
              />
            ))
          ) : (
            <Typography>Vous n'avez aucune série pour le moment.</Typography>
          )}
        </SetsContainer>

        {!disabled && (
          <>
            <Button onClick={addEmptySet}>Ajouter une série</Button>
            <Button
              onClick={handleSubmit(onSubmit, onError)}
              disabled={!isDirty}
            >
              Submit
            </Button>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
