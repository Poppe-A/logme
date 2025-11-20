import { styled, TextField } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { FIELD_TYPE, type FieldType, type FieldWidth } from './types';
import { FIELD_WIDTH } from './constants';
import type { ChangeEvent } from 'react';

type StyledMobileProps = {
  width?: FieldWidth;
};

const StyledTextField = styled(TextField, {
  shouldForwardProp: prop => prop !== 'width',
})<StyledMobileProps>`
  min-width: 4rem;
  width: ${({ width }) => {
    if (width) {
      return FIELD_WIDTH[width];
    }
  }};
`;

interface IFormTextField<T extends FieldValues> {
  fieldType: FieldType;
  label: string;
  name: Path<T>;
  control?: Control<T>;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  width?: FieldWidth;
  onBlur?: () => void;
  disabled?: boolean;
}

export function FormTextField<T extends FieldValues>({
  control,
  fieldType,
  label,
  name,
  size = 'medium',
  fullWidth = false,
  required = false,
  width,
  onBlur,
  disabled,
}: IFormTextField<T>) {
  const rules = {
    required: required ? `${name} is required` : undefined,
  };

  const formatValue = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (fieldType === FIELD_TYPE.NUMBER && typeof value === 'string') {
      return parseInt(value);
    }

    return value;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <StyledTextField
          {...field}
          onChange={e => field.onChange(formatValue(e))}
          type={fieldType}
          label={label}
          variant="outlined"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth={fullWidth}
          required={required}
          size={size}
          width={width}
          onBlur={onBlur}
          disabled={disabled}
          // maxRows={}
        />
      )}
    />
  );
}
