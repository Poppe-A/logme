import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { EXERCISE_TYPE, type Exercise } from './exerciseApi';
import { FormTextField } from '../../components/form/FormTextField';
import { FIELD_TYPE } from '../../components/form/types';
import { GenericSelect } from '../../components/GenericSelect';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { capitalizeFirstLetter } from '../../utils/format';
import { GenericModal } from '../../components/GenericModal';
import { useTranslation } from 'react-i18next';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
`;

interface IExerciseForm {
  isOpen: boolean;
  onSubmit: (sport: Exercise | Omit<Exercise, 'id'>) => void;
  exercise: Exercise | null;
  closeModal: () => void;
}

export const ExerciseForm: React.FC<IExerciseForm> = ({
  exercise,
  isOpen,
  onSubmit,
  closeModal,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm<Exercise>({
    values: {
      name: exercise?.name || '',
      type: exercise?.type || undefined,
      description: exercise?.description || '',
      altName: exercise?.altName || '',
      secondAltName: exercise?.secondAltName || '',
    },
  });

  const buildTypeItems = () => {
    const itemTypesValues = Object.values(EXERCISE_TYPE);
    return itemTypesValues.map(item => ({
      label: capitalizeFirstLetter(item),
      value: item,
    }));
  };

  const submitForm: SubmitHandler<Exercise> = data => {
    onSubmit(data);
    reset();
    closeModal();
  };

  const handleError: SubmitErrorHandler<Exercise> = error => {
    console.log('error', error);
  };

  return (
    <GenericModal
      open={isOpen}
      handleConfirm={handleSubmit(submitForm, handleError)}
      handleClose={closeModal}
      title={exercise ? t('exercises.update') : t('exercises.add')}
    >
      <FormContainer>
        <FormTextField
          control={control}
          name="name"
          label={t('exercises.name')}
          fieldType={FIELD_TYPE.TEXT}
          required
        />
        <Controller
          name="type"
          control={control}
          rules={{ required: t('exercises.typeRequired') }}
          render={({ field, fieldState }) => (
            <GenericSelect
              onChange={e => field.onChange(e.target.value)}
              label={t('exercises.type')}
              items={buildTypeItems()}
              value={field.value}
              required
              error={fieldState.error}
            />
          )}
        />
        <FormTextField
          control={control}
          name="altName"
          label={t('exercises.altName')}
          fieldType={FIELD_TYPE.TEXT}
        />
        <FormTextField
          control={control}
          name="secondAltName"
          label={t('exercises.secondAltName')}
          fieldType={FIELD_TYPE.TEXT}
        />
        <FormTextField
          control={control}
          name="description"
          label={t('exercises.description')}
          fieldType={FIELD_TYPE.TEXT}
        />
      </FormContainer>
    </GenericModal>
  );
};
