import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IDatePicker {
  value: Dayjs | null;
  onChange: (val: Dayjs | null) => void;
}

export const GenericDatePicker: React.FC<IDatePicker> = ({
  value,
  onChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'fr'}>
      <DatePicker
        value={value}
        onChange={onChange}
        timezone="Europe/Paris"
        label={'Date'}
        format="DD/MM/YYYY"
      />
    </LocalizationProvider>
  );
};
