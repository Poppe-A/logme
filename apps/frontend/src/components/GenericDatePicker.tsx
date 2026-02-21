import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import 'dayjs/locale/fr';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IDatePickerProps {
  size?: 'small' | 'normal';
}

const StyledDatePicker = styled(DateTimePicker)<IDatePickerProps>`
  min-width: ${({ size }) => (size === 'small' ? '200px' : 'inherit')};
  & .MuiPickersInputBase-root {
    width: ${({ size }) => (size === 'small' ? '200px' : 'inherit')};
  }
`;
interface IDatePicker {
  value: Dayjs | null;
  onChange: (val: Dayjs | null) => void;
  label?: string;
  size?: 'small' | 'normal';
}

export const GenericDatePicker: React.FC<IDatePicker> = ({
  value,
  onChange,
  label,
  size,
}) => {
  const { t } = useTranslation();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'fr'}>
      <StyledDatePicker
        value={value}
        onChange={onChange}
        timezone="Europe/Paris"
        label={label ?? t('common.date')}
        format="DD/MM/YYYY HH:mm"
        size={size}
      />
      {/* <DateTimePicker /> */}
    </LocalizationProvider>
  );
};
