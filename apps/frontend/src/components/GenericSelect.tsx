import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { FieldError } from 'react-hook-form';

interface IGenericSelect {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: SelectChangeEvent<any>) => void;
  label: string;
  value?: number | number[] | string;
  required?: boolean;
  error?: FieldError;
  multiple?: boolean;
  renderValue?: () => string;
}
export const GenericSelect: React.FC<IGenericSelect> = ({
  items,
  label,
  onChange,
  value,
  error,
  required = false,
  multiple = false,
  renderValue,
}) => {
  return (
    <FormControl required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={onChange}
        error={Boolean(error)}
        multiple={Boolean(multiple)}
        renderValue={renderValue}
      >
        {items.map(item => {
          return multiple && Array.isArray(value) ? (
            <MenuItem key={item.value} value={item.value}>
              <Checkbox checked={value.includes(item.value)} />
              <ListItemText primary={item.label} />
            </MenuItem>
          ) : (
            <MenuItem value={item.value}>{item.label}</MenuItem>
          );
        })}
      </Select>
      {error?.message && (
        <FormHelperText error={Boolean(error)}>{error.message}</FormHelperText>
      )}
    </FormControl>
  );
};
