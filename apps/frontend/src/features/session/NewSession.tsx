import { Box, Chip, CircularProgress, styled, Typography } from '@mui/material';
import { PageLayout } from '../../components/PageLayout';
import { useGetSportsQuery } from '../sport/sportApi';

import { capitalizeFirstLetter } from '../../utils/format';
import { useGetExercisesQuery } from '../exercise/exerciseApi';
import dayJs from 'dayjs';
import { GenericDatePicker } from '../../components/GenericDatePicker';

import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import type { INewSessionFormData } from './types';
import { FormTextField } from '../../components/form/FormTextField';
import { FIELD_TYPE } from '../../components/form/types';
import { FormSelect, type ISelectItem } from '../../components/form/FormSelect';
import { MainActionButton } from '../../components/MainActionButton';
import { useAppDispatch } from '../../utils/store';
import { createSessionWithExercises } from './sessionSlice';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-inline: 1rem;
  gap: 1rem;
`;

const SelectedExercisesContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const NewSession: React.FC = () => {
  const { data: sports, isLoading: isSportsLoading } = useGetSportsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues: INewSessionFormData = {
    startDate: dayJs(),
    name: 'New Session',
    sportId: undefined,
    exercises: [],
  };
  // todo use a form with validation
  const { handleSubmit, control, watch } = useForm<INewSessionFormData>({
    defaultValues: initialValues,
  });
  const sportId = watch().sportId;
  const selectedExercises = watch().exercises;

  const { data: exercises = [], isLoading: isExercisesLoading } =
    useGetExercisesQuery({
      sportId: sportId,
    });

  const displayExercises =
    sportId && !isExercisesLoading && Boolean(exercises?.length);

  const buildSportItems = (): ISelectItem[] => {
    if (!sports?.length) {
      return [];
    }

    return sports.map(sport => ({
      value: sport.id as number,
      label: capitalizeFirstLetter(sport.name),
    }));
  };

  const buildExerciseItems = (): ISelectItem[] => {
    return exercises
      ? exercises.map(exercise => ({
          value: exercise.id as number,
          label: exercise.name,
        }))
      : [];
  };

  const getSelectedExerciseNames = (): string[] => {
    const selectedExercisesNames = selectedExercises.map(exerciseId => {
      const exercise = exercises?.find(ex => ex.id === exerciseId);
      return capitalizeFirstLetter(exercise?.name || '');
    });

    return selectedExercisesNames.filter(ex => Boolean(ex));
  };

  const onSubmit: SubmitHandler<INewSessionFormData> = async data => {
    const createdSessionId = await dispatch(
      createSessionWithExercises({
        ...data,
        startDate: data.startDate.toDate(),
      }),
    ).unwrap();
    navigate(`/sessions/${createdSessionId}`);
  };

  const handleErrors: SubmitErrorHandler<INewSessionFormData> = async data => {
    console.log('error', data);
  };

  return (
    <PageLayout title="New session">
      <FormContainer>
        <Typography>Nom de la session :</Typography>
        <FormTextField
          control={control}
          name="name"
          label="Name"
          fieldType={FIELD_TYPE.TEXT}
          required
          fullWidth={true}
        />

        <Typography>Date de la séance :</Typography>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <GenericDatePicker value={value} onChange={onChange} />
          )}
        />
        <Typography>Choisissez votre sport :</Typography>
        {isSportsLoading || !sports?.length ? (
          <CircularProgress />
        ) : (
          <FormSelect
            control={control}
            name="sportId"
            label="Sport"
            items={buildSportItems()}
          />
        )}

        {displayExercises && (
          <>
            <Typography>Choisissez vos exercices :</Typography>
            <Typography variant="caption">
              Vous aurez la possibilité de modifier cet liste par la suite
            </Typography>

            <FormSelect
              control={control}
              name="exercises"
              label="Exercises"
              items={buildExerciseItems()}
              renderValue={() => getSelectedExerciseNames().join(', ')}
              multiple
            />

            {selectedExercises.length ? (
              <Typography>Exercices sélectionnés :</Typography>
            ) : null}
            <SelectedExercisesContainer>
              {getSelectedExerciseNames().map(ex => (
                <Chip key={ex} label={ex} size="small" />
              ))}
            </SelectedExercisesContainer>
          </>
        )}

        {sportId && !isExercisesLoading && exercises?.length === 0 && (
          <Typography>Pas d'exercices pour ce sport</Typography>
        )}
      </FormContainer>

      <MainActionButton
        onClick={handleSubmit(onSubmit, handleErrors)}
        label="GO !"
      />
    </PageLayout>
  );
};
