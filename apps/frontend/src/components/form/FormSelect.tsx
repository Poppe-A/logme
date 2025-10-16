import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { GenericSelect } from '../GenericSelect';

export interface ISelectItem {
  value: number;
  label: string;
}

interface IFormSelect<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  items: ISelectItem[];
  multiple?: boolean;
  renderValue?: () => string;
  required?: boolean;
}

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  items,
  multiple = false,
  renderValue,
  required = false,
}: IFormSelect<T>) => {
  const rules = {
    required: required ? `${name} is required` : undefined,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState }) => {
        console.log('error', fieldState.error);
        return (
          <GenericSelect
            label={label}
            value={value}
            onChange={e => onChange(e.target.value)}
            items={items}
            multiple={multiple}
            renderValue={renderValue}
            required={required}
            error={fieldState.error}
          />
        );
      }}
    />
  );
};
