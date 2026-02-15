import dayjs from 'dayjs';

export const toApiDate = (value: string | Date): string => dayjs(value).format('YYYY-MM-DD');

export const defaultDateRange = (): { startDate: string; endDate: string } => ({
  startDate: dayjs().subtract(9, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
});
