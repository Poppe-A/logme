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
import { useTranslation } from 'react-i18next';
import { FormAutoComplete } from '../../components/form/FormAutocomplete';

const FormContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-inline: 1rem;
  padding-bottom: 3rem;
  gap: 1rem;
`;

const SelectedExercisesContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const NewSession: React.FC = () => {
  const { t } = useTranslation();
  const { data: sports, isLoading: isSportsLoading } = useGetSportsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues: INewSessionFormData = {
    startDate: dayJs(),
    name: 'New Session',
    sportId: undefined,
    exercises: [],
  };
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
    console.log('test');
    return exercises
      ? exercises
          .filter(
            exercise => !selectedExercises.find(ex => ex.value === exercise.id),
          )
          .map(exercise => ({
            value: exercise.id as number,
            label: exercise.name,
          }))
      : [];
  };

  const getSelectedExerciseNames = (): string[] => {
    const selectedExercisesNames = selectedExercises.map(exercise => {
      return capitalizeFirstLetter(exercise.label || '');
    });
    return selectedExercisesNames.filter(ex => Boolean(ex));
  };

  const onSubmit: SubmitHandler<INewSessionFormData> = async data => {
    const createdSessionId = await dispatch(
      createSessionWithExercises({
        ...data,
        exercises: selectedExercises.map(ex => ex.value),
        startDate: data.startDate.toDate(),
      }),
    ).unwrap();
    navigate(`/sessions/${createdSessionId}`);
  };

  const handleErrors: SubmitErrorHandler<INewSessionFormData> = async data => {
    console.log('new sessionerror', data);
  };

  return (
    <PageLayout title={t('sessions.new')}>
      <FormContainer>
        <Typography>{t('sessions.sessionName')} :</Typography>
        <FormTextField
          control={control}
          name="name"
          label={t('sessions.sessionName')}
          fieldType={FIELD_TYPE.TEXT}
          required
          fullWidth={true}
        />

        <Typography>{t('sessions.sessionDate')} :</Typography>
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <GenericDatePicker value={value} onChange={onChange} />
          )}
        />
        <Typography>{t('sessions.sessionSport')} :</Typography>
        {isSportsLoading || !sports?.length ? (
          <CircularProgress />
        ) : (
          <FormSelect
            control={control}
            name="sportId"
            label={t('sessions.sportLabel')}
            items={buildSportItems()}
            required
          />
        )}

        {displayExercises && (
          <>
            <Typography>{t('sessions.sessionExerciseChoice')}</Typography>
            <Typography variant="caption">
              {t('sessions.exercisesComment')}
            </Typography>

            <FormAutoComplete
              control={control}
              name="exercises"
              label={t('sessions.exercisesLabel')}
              items={buildExerciseItems()}
              // renderValue={() => getSelectedExerciseNames().join(', ')}
              multiple
            />

            {selectedExercises.length ? (
              <Typography>{t('sessions.selectedExercises')} :</Typography>
            ) : null}
            <SelectedExercisesContainer>
              {getSelectedExerciseNames().map(ex => (
                <Chip key={ex} label={ex} size="small" />
              ))}
            </SelectedExercisesContainer>
          </>
        )}

        {sportId && !isExercisesLoading && exercises?.length === 0 && (
          <Typography>{t('exercises.noExercise')}</Typography>
        )}
      </FormContainer>

      <MainActionButton
        onClick={handleSubmit(onSubmit, handleErrors)}
        label="GO !"
        // disabled={!sportId}
      />
    </PageLayout>
  );
};
