import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { Autocomplete, styled, TextField } from '@mui/material';

const StyledTextField = styled(TextField)`
  width: 100%;
`;

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
  required?: boolean;
}

export const FormAutoComplete = <T extends FieldValues>({
  name,
  control,
  label,
  items,
  multiple = false,
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
      render={({ field: { onChange, value } }) => {
        return (
          <Autocomplete
            multiple={multiple}
            id="tags-standard"
            fullWidth
            options={items}
            getOptionLabel={option => option.label}
            value={value}
            onChange={(_, value) => onChange(value)}
            renderInput={params => (
              <StyledTextField
                {...params}
                variant="outlined"
                label={label}
                size="medium"
                fullWidth
              />
            )}
          />
        );
      }}
    />
  );
};
