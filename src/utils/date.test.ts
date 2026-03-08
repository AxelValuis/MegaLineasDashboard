import dayjs from 'dayjs';
import { defaultDateRange, toApiDate } from './date';

describe('date utils', () => {
  it('formats a date using the API format', () => {
    expect(toApiDate('2026-03-07')).toBe('2026-03-07');
  });

  it('returns a 10-day default range ending today', () => {
    const range = defaultDateRange();
    expect(range.endDate).toBe(dayjs().format('YYYY-MM-DD'));
    expect(range.startDate).toBe(dayjs().subtract(9, 'day').format('YYYY-MM-DD'));
  });
});
