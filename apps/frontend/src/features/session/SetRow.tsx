import { Box, IconButton, styled, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormTextField } from '../../components/form/FormTextField';
import { FIELD_TYPE } from '../../components/form/types';
import type { FormValue, ISetRow } from './types';
import { Delete } from '@mui/icons-material';

const StyledRow = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  /* padding-inline: 1rem; */
`;

export const SetRow = ({
  control,
  index,
  onDelete,
  disabled,
}: ISetRow<FormValue>) => {
  return (
    <StyledRow>
      <Typography>Série {index + 1}</Typography>

      <Controller
        name={`sets.${index}.repetitions`}
        control={control}
        rules={{
          min: { value: 0, message: 'Min 0' },
          max: { value: 999, message: 'Max 999' },
        }}
        render={({ field }) => (
          <FormTextField
            name={field.name}
            fieldType={FIELD_TYPE.NUMBER}
            label="Répétitions"
            size="small"
            control={control}
            width="SMALL_MEDIUM"
            disabled={disabled}
          />
        )}
      />

      <Controller
        name={`sets.${index}.weight`}
        control={control}
        rules={{
          min: { value: 0, message: 'Min 0' },
          max: { value: 9999, message: 'Max 9999' },
        }}
        render={({ field }) => (
          <FormTextField
            name={field.name}
            fieldType={FIELD_TYPE.NUMBER}
            control={control}
            label="Poids (kg)"
            size="small"
            width="SMALL_MEDIUM"
            disabled={disabled}
          />
        )}
      />

      {!disabled && (
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      )}
    </StyledRow>
  );
};
