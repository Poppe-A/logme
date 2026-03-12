import { useEffect, useState, type ChangeEvent } from 'react';
import type { NumberType } from './types';
import { StyledTextField } from './form/FormTextField';
import type { FieldSize, FieldWidth } from './form/types';
import { FIELD_SIZE } from './form/constants';
import { removeLastsNullDecimals } from '../utils/format';

interface INumberFieldProps {
  value: unknown;
  onFieldChange: (val: string | number) => void;
  numberOfDecimals?: number;
  numberType?: NumberType;
  label?: string;
  size?: FieldSize;
  width?: FieldWidth;
  disabled?: boolean;
}

export const NumberField: React.FC<INumberFieldProps> = ({
  value,
  onFieldChange,
  numberOfDecimals = 0,
  numberType = 'amount',
  label,
  size = FIELD_SIZE.MEDIUM,
  width,
  disabled,
}) => {
  const [valueToDisplay, setValueToDisplay] = useState<string>('');

  const formatValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let valueToFormat: string | number = e.target.value;
    if (!valueToFormat) {
      return '';
    }
    const lastTyped = e.target.value.slice(
      e.target.value.length - 1,
      e.target.value.length,
    );
    valueToFormat =
      !isNaN(parseInt(lastTyped)) ||
      (numberOfDecimals > 0 && lastTyped === '.') ||
      (numberOfDecimals > 0 && lastTyped === ',')
        ? e.target.value
        : (valueToFormat = e.target.value.slice(0, e.target.value.length - 1));

    valueToFormat = valueToFormat.replace(',', '.');
    valueToFormat = valueToFormat.replace(/[^0-9.]/g, '');
    valueToFormat = removeExtraDecimals(valueToFormat.toString());

    return valueToFormat;
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const formattedValue = formatValue(e);

    setValueToDisplay(formattedValue);
    onFieldChange(formattedValue ?? 0);
  };

  const removeExtraDecimals = (valueToFormat: string) => {
    const decimal = valueToFormat.split('.');
    if (decimal[1]) {
      decimal[1] = decimal[1].slice(0, numberOfDecimals);
    }
    return decimal.join('.');
  };

  const formatDisplayedValue = (valueToProcess: string | number) => {
    let formattedValue = valueToProcess;

    if (valueToProcess) {
      formattedValue = valueToProcess.toString();
      if (numberType === 'amount') {
        formattedValue = parseFloat(formattedValue);
        formattedValue = formatAmountNumberToDisplay(
          formattedValue,
          numberOfDecimals,
        );
      }
    }

    return formattedValue;
  };

  const formatAmountNumberToDisplay = (
    value: number,
    numberOfDecimals: number,
  ) => {
    const formattedValue = value
      .toFixed(numberOfDecimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return removeLastsNullDecimals(formattedValue);
  };

  useEffect(() => {
    if (valueToDisplay === '') {
      const displayableValue = formatDisplayedValue(value as string | number);
      setValueToDisplay(displayableValue?.toString() ?? '');
    }
  }, []);

  return (
    <StyledTextField
      onChange={handleOnChange}
      value={valueToDisplay}
      label={label}
      size={size as FieldSize}
      width={width}
      disabled={disabled}
    />
  );
};
