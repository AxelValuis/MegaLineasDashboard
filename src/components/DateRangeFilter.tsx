import { Stack, TextField } from '@mui/material';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (nextStartDate: string, nextEndDate: string) => void;
}

const DateRangeFilter = ({ startDate, endDate, onChange }: DateRangeFilterProps): JSX.Element => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
    <TextField
      size="small"
      type="date"
      label="Fecha inicio"
      value={startDate}
      onChange={(event) => onChange(event.target.value, endDate)}
      InputLabelProps={{ shrink: true }}
      fullWidth
      sx={{ minWidth: { sm: 170 } }}
    />
    <TextField
      size="small"
      type="date"
      label="Fecha fin"
      value={endDate}
      onChange={(event) => onChange(startDate, event.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
      sx={{ minWidth: { sm: 170 } }}
    />
  </Stack>
);

export default DateRangeFilter;
