import { Box, IconButton, styled, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { FormTextField } from '../../components/form/FormTextField';
import { FIELD_TYPE } from '../../components/form/types';
import type { FormValue, ISetRow } from './types';
import { Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const StyledRow = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  /* padding-inline: 1rem; */
`;

export const SetRow = ({
  control,
  index,
  onDelete,
  disabled,
}: ISetRow<FormValue>) => {
  const { t } = useTranslation();
  return (
    <StyledRow>
      <Typography>
        {t('sessions.sets.set')} {index + 1}
      </Typography>

      <Controller
        name={`sets.${index}.repetitions`}
        control={control}
        rules={{
          min: { value: 0, message: t('sessions.sets.repetitionsMin') },
          max: { value: 999, message: t('sessions.sets.repetitionsMax') },
        }}
        render={({ field }) => (
          <FormTextField
            name={field.name}
            fieldType={FIELD_TYPE.NUMBER}
            label={t('sessions.sets.repetitions')}
            size="small"
            control={control}
            width="SMALL_MEDIUM" // todo use enum
            disabled={disabled}
          />
        )}
      />

      <Controller
        name={`sets.${index}.weight`}
        control={control}
        rules={{
          min: { value: 0, message: t('sessions.sets.weightMin') },
          max: { value: 9999, message: t('sessions.sets.weightMax') },
        }}
        render={({ field }) => (
          <FormTextField
            name={field.name}
            fieldType={FIELD_TYPE.NUMBER}
            control={control}
            label={t('sessions.sets.weightLabel')}
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
