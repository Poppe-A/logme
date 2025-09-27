import { TextField } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import type { FieldType } from './types';

interface IFormTextField<T extends FieldValues> {
  fieldType: FieldType;
  label: string;
  name: Path<T>;
  control?: Control<T>;
  required?: boolean;
  fullWidth?: boolean;
}

export function FormTextField<T extends FieldValues>({
  control,
  fieldType,
  label,
  name,
  fullWidth = false,
  required = false,
}: IFormTextField<T>) {
  const rules = {
    required: required ? `${name} is required` : undefined,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={fieldType}
          label={label}
          variant="outlined"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth={fullWidth}
          // margin="normal"
          required={required}
        />
      )}
    />
  );
}
