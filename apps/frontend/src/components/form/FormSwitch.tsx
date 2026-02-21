import { FormControlLabel, styled, Switch } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { type FieldWidth } from './types';

interface IFormSwitch<T extends FieldValues> {
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

export const StyledFormControlLabel = styled(FormControlLabel)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0;
  & .MuiFormControlLabel-label {
    text-align: left;
  }
`;

export function FormSwitch<T extends FieldValues>({
  control,
  label,
  name,
  //   size = 'medium',
  //   fullWidth = false,
  //   required = false,
  //   width,
  //   onBlur,
  disabled,
}: IFormSwitch<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <StyledFormControlLabel
          disabled={disabled}
          labelPlacement="start" // todo use enum
          control={
            <Switch
              checked={value}
              onChange={ev => onChange(ev.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  );
}
