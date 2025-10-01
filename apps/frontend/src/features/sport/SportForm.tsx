import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { GenericModal } from '../../components/GenericModal';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import type { ISportForm } from './types';
import { FormTextField } from '../../components/form/FormTextField';
import { FIELD_TYPE } from '../../components/form/types';
import type { Sport } from './sportApi';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
`;

export const SportForm: React.FC<ISportForm> = ({
  sport,
  isOpen,
  onSubmit,
  closeModal,
}) => {
  const {
    handleSubmit,
    control,
    // formState: { errors },
    reset,
  } = useForm<Sport>({
    values: {
      name: sport?.name || '',
      description: sport?.description || '',
    },
  });

  //  validation de donnée yup
  // todo checker si le sport existe déjà
  const submitForm: SubmitHandler<Sport> = data => {
    onSubmit({ ...data, id: sport?.id });
    reset();
    closeModal();
  };

  const handleError: SubmitErrorHandler<Sport> = error => {
    console.log('error', error);
  };

  return (
    <GenericModal
      open={isOpen}
      handleConfirm={handleSubmit(submitForm, handleError)}
      handleClose={closeModal}
      title={sport ? 'Update sport' : 'New sport'}
    >
      <FormContainer>
        <FormTextField
          control={control}
          name="name"
          label="Name"
          fieldType={FIELD_TYPE.TEXT}
          required
        />
        <FormTextField
          control={control}
          name="description"
          label="Description"
          fieldType={FIELD_TYPE.TEXT}
          // required
        />
      </FormContainer>
    </GenericModal>
  );
};
