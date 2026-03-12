import React from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';

import { NumberField } from '../NumberField';
import type { NumberType } from '../types';
import type { FieldSize, FieldWidth } from './types';
import { FIELD_SIZE } from './constants';

interface IFormNumberFieldProps {
  name: string;
  label: string;
  control: Control<FieldValues>;
  numberOfDecimals?: number;
  numberType?: NumberType;
  size?: FieldSize;
  width?: FieldWidth;
  disabled?: boolean;
}

export const FormNumberField: React.FC<IFormNumberFieldProps> = ({
  name,
  control,
  numberOfDecimals = 0,
  numberType = 'amount',
  label,
  size = FIELD_SIZE.MEDIUM,
  width,
  disabled,
}) => {
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
