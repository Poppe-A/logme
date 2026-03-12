import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { NumberField } from '../NumberField';
import type { NumberType } from '../types';
import type { FieldSize, FieldWidth } from './types';
import { FIELD_SIZE } from './constants';

interface IFormNumberFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  numberOfDecimals?: number;
  numberType?: NumberType;
  size?: FieldSize;
  width?: FieldWidth;
  disabled?: boolean;
}

export const FormNumberField = <TFieldValues extends FieldValues>({
  name,
  control,
  numberOfDecimals = 0,
  numberType = 'amount',
  label,
  size = FIELD_SIZE.MEDIUM,
  width,
  disabled,
}: IFormNumberFieldProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <NumberField
            onFieldChange={onChange}
            value={value as number}
            numberOfDecimals={numberOfDecimals}
            numberType={numberType}
            label={label}
            size={size}
            width={width}
            disabled={disabled}
          />
        );
      }}
    />
  );
};
