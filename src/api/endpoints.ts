import dayjs from 'dayjs';
import { abcdeMock, alertsMock, metricsMock, planificadorMock, supportByDayMock, topProductosMock } from './mockData';
import type { AbcdeLetter, AbcdeRow, AlertItem, DateRangeParams, Metrics, PlanItem, SupportByDayPoint, TopProductoRow } from './types';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 300);
  });

const withinRange = (value: string, startDate: string, endDate: string): boolean => {
  const date = dayjs(value);
  return (date.isAfter(dayjs(startDate).subtract(1, 'day')) && date.isBefore(dayjs(endDate).add(1, 'day')));
};

export const fetchDashboardMetrics = async (_params: DateRangeParams): Promise<Metrics> => {
  // TODO (API real):
  // return apiClient.get('/dashboard/metrics', { params: _params }).then((r) => r.data);
  return delay(metricsMock);
};

export const fetchTopProductos = async (_params: DateRangeParams): Promise<TopProductoRow[]> => {
  // TODO (API real):
  // return apiClient.get('/productos/top', { params: _params }).then((r) => r.data);
  return delay(topProductosMock);
};

export const fetchAbcde = async (_params: DateRangeParams, letter?: AbcdeLetter): Promise<AbcdeRow[]> => {
  // TODO (API real):
  // return apiClient.get('/productos/abcde', { params: { ..._params, letter } }).then((r) => r.data);
  return delay(letter ? abcdeMock.filter((row) => row.abcde === letter) : abcdeMock);
};

export const fetchAlerts = async (_params: DateRangeParams): Promise<AlertItem[]> => {
  // TODO (API real):
  // return apiClient.get('/dashboard/alerts', { params: _params }).then((r) => r.data);
  return delay(alertsMock);
};

export const fetchSupportByDay = async (_params: DateRangeParams): Promise<SupportByDayPoint[]> => {
  // TODO (API real):
  // return apiClient.get('/dashboard/support-by-day', { params: _params }).then((r) => r.data);
  const filtered = supportByDayMock.filter((point) => withinRange(point.date, _params.start_date, _params.end_date));
  return delay(filtered.length > 0 ? filtered : supportByDayMock);
};

export const fetchPlanificador = async (params: DateRangeParams, category?: string, product?: string): Promise<PlanItem[]> => {
  // TODO (API real):
  // return apiClient.get('/planificador', { params: { ...params, category, product } }).then((r) => r.data);
  const filtered = planificadorMock.filter((row) => {
    const inDate = withinRange(row.fecha, params.start_date, params.end_date);
    const inCategory = category ? row.categoria === category : true;
    const inProduct = product ? row.producto === product : true;
    return inDate && inCategory && inProduct;
  });

  return delay(filtered);
};
