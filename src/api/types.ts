export type Severity = 'Alta' | 'Media' | 'Baja';
export type AbcdeLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export interface TopProductoRow {
  id: string;
  item: string;
  soporte_absoluto: number;
  soporte_relativo: number;
  description: string;
  category: string;
}

export interface AbcdeRow {
  id: string;
  itemCode: string;
  abcde: AbcdeLetter;
}

export interface AlertItem {
  id: string;
  severity: Severity;
  message: string;
}

export interface PlanItem {
  id: string;
  fecha: string;
  item: string;
  producto: string;
  estado: 'Pendiente' | 'En curso' | 'Completado';
  responsable: string;
  observacion: string;
  categoria: string;
}

export interface Metrics {
  totalItems: number;
  totalVentasSoporte: number;
  porcentajeA: number;
  porcentajeB: number;
  alertas: number;
  cobertura: number;
}

export interface SupportByDayPoint {
  date: string;
  soporte: number;
}

export interface DateRangeParams {
  start_date: string;
  end_date: string;
}
