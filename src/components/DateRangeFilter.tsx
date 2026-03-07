import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { InputAdornment, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (nextStartDate: string, nextEndDate: string) => void;
}

const toPickerValue = (value: string): Dayjs | null => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const DateRangeFilter = ({ startDate, endDate, onChange }: DateRangeFilterProps): JSX.Element => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
    <DatePicker
      label="Fecha inicio"
      value={toPickerValue(startDate)}
      format="DD/MM/YYYY"
      onChange={(value) => {
        if (value?.isValid()) {
          onChange(value.format('YYYY-MM-DD'), endDate);
        }
      }}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
          sx: { minWidth: { sm: 170 } },
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        },
        popper: {
          placement: 'bottom-start',
        },
      }}
    />
    <DatePicker
      label="Fecha fin"
      value={toPickerValue(endDate)}
      format="DD/MM/YYYY"
      onChange={(value) => {
        if (value?.isValid()) {
          onChange(startDate, value.format('YYYY-MM-DD'));
        }
      }}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
          sx: { minWidth: { sm: 170 } },
          InputProps: {
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        },
        popper: {
          placement: 'bottom-start',
        },
      }}
    />
  </Stack>
);

export default DateRangeFilter;
