import dayjs from 'dayjs';
import type {
  AbcdeLetter,
  AbcdeRow,
  AlertItem,
  Metrics,
  PlanItem,
  SupportByDayPoint,
  TopProductoRow,
} from './types';

const categories = [
  'Adhesivos',
  'Brochas',
  'Pinturas',
  'Selladores',
  'Rodillos',
  'Cintas',
  'Disolventes',
  'Lijas',
];

const responsibles = [
  'Ana Ruiz',
  'Luis Soto',
  'Carla Mena',
  'Mario Silva',
  'Julia Ponce',
  'Pedro Flores',
  'Marco Leon',
  'Rosa Vega',
];

const abcdeCycle: AbcdeLetter[] = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'E'];

export const topProductosMock: TopProductoRow[] = Array.from({ length: 72 }).map((_, i) => {
  const index = i + 1;
  const code = `ITM-${(1000 + index).toString()}`;
  const category = categories[i % categories.length];
  const soporte = 1800 - i * 17;
  const soporteRelativo = Number((22.5 - i * 0.22).toFixed(2));
  return {
    id: String(index),
    item: code,
    soporte_absoluto: Math.max(120, soporte),
    soporte_relativo: Math.max(0.5, soporteRelativo),
    description: `${category} Producto ${index}`,
    category,
  };
});

export const abcdeMock: AbcdeRow[] = topProductosMock.map((row, i) => ({
  id: row.id,
  itemCode: row.item,
  abcde: abcdeCycle[i % abcdeCycle.length],
}));

export const alertsMock: AlertItem[] = [
  { id: 'a1', severity: 'Alta', message: 'ITM-1001 supera umbral de demanda proyectada.' },
  { id: 'a2', severity: 'Media', message: 'Retraso de proveedor para categoria Brochas.' },
  { id: 'a3', severity: 'Baja', message: 'Stock minimo recomendado para Selladores.' },
];

export const metricsMock: Metrics = {
  totalItems: topProductosMock.length,
  totalVentasSoporte: topProductosMock.reduce((acc, row) => acc + row.soporte_absoluto, 0),
  porcentajeA: 32.4,
  porcentajeB: 27.6,
  alertas: alertsMock.length,
  cobertura: 92.3,
};

export const planificadorMock: PlanItem[] = Array.from({ length: 68 }).map((_, i) => {
  const index = i + 1;
  const producto = topProductosMock[i % topProductosMock.length];
  const estadoCycle: PlanItem['estado'][] = ['Pendiente', 'En curso', 'Completado'];
  return {
    id: `p${index}`,
    fecha: dayjs().subtract(20 - (i % 35), 'day').format('YYYY-MM-DD'),
    item: producto.item,
    producto: producto.description,
    estado: estadoCycle[i % estadoCycle.length],
    responsable: responsibles[i % responsibles.length],
    observacion: `Revision de lote ${index}`,
    categoria: producto.category,
  };
});

export const supportByDayMock: SupportByDayPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  date: dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'),
  soporte: 580 + i * 24 + (i % 4 === 0 ? 40 : -15),
}));
