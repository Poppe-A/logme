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
}

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  items,
  multiple = false,
  renderValue,
}: IFormSelect<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <GenericSelect
            label={label}
            value={value}
            onChange={e => onChange(e.target.value)}
            items={items}
            multiple={multiple}
            renderValue={renderValue}
          />
        );
      }}
    />
  );
};
