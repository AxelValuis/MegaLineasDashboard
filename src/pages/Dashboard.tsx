import { Alert, Box, CircularProgress, Pagination, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  fetchAbcde,
  fetchAlerts,
  fetchDashboardMetrics,
  fetchSupportByDay,
  fetchTopProductos,
} from '../api/endpoints';
import type {
  AbcdeRow,
  AlertItem,
  Metrics,
  SupportByDayPoint,
  TopProductoRow,
} from '../api/types';
import AlertsPanel from '../components/AlertsPanel';
import DateRangeFilter from '../components/DateRangeFilter';
import KpiCard from '../components/KpiCard';
import MobileRecordCard from '../components/MobileRecordCard';
import { defaultDateRange, toApiDate } from '../utils/date';

const topColumns: GridColDef<TopProductoRow>[] = [
  { field: 'item', headerName: 'Articulo', flex: 1, minWidth: 120 },
  { field: 'soporte_absoluto', headerName: 'Soporte absoluto', flex: 1, minWidth: 140 },
  { field: 'soporte_relativo', headerName: 'Soporte relativo (%)', flex: 1, minWidth: 140 },
  { field: 'description', headerName: 'Descripcion', flex: 1.6, minWidth: 200 },
];

const abcdeColumns: GridColDef<AbcdeRow>[] = [
  { field: 'itemCode', headerName: 'Codigo', flex: 1, minWidth: 160 },
  { field: 'abcde', headerName: 'ABCDE', flex: 1, minWidth: 120 },
];

const Dashboard = (): JSX.Element => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mobilePageSize = 6;
  const initialRange = defaultDateRange();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [topProductos, setTopProductos] = useState<TopProductoRow[]>([]);
  const [abcdeRows, setAbcdeRows] = useState<AbcdeRow[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [supportByDay, setSupportByDay] = useState<SupportByDayPoint[]>([]);
  const [topSearch, setTopSearch] = useState('');
  const [abcdeSearch, setAbcdeSearch] = useState('');
  const [topPage, setTopPage] = useState(1);
  const [abcdePage, setAbcdePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({ start_date: toApiDate(startDate), end_date: toApiDate(endDate) }),
    [startDate, endDate],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    Promise.all([
      fetchDashboardMetrics(params),
      fetchTopProductos(params),
      fetchAbcde(params),
      fetchAlerts(params),
      fetchSupportByDay(params),
    ])
      .then(([nextMetrics, nextTop, nextAbcde, nextAlerts, nextSupport]) => {
        if (!active) {
          return;
        }
        setMetrics(nextMetrics);
        setTopProductos(nextTop);
        setAbcdeRows(nextAbcde);
        setAlerts(nextAlerts);
        setSupportByDay(nextSupport);
      })
      .catch(() => {
        if (active) {
          setError('No fue posible cargar la data del dashboard.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params]);

  const filteredTopProductos = useMemo(() => {
    const term = topSearch.toLowerCase();
    return topProductos.filter(
      (row) => row.item.toLowerCase().includes(term) || row.description.toLowerCase().includes(term),
    );
  }, [topProductos, topSearch]);

  const filteredAbcdeRows = useMemo(() => {
    const term = abcdeSearch.toLowerCase();
    return abcdeRows.filter(
      (row) => row.itemCode.toLowerCase().includes(term) || row.abcde.toLowerCase().includes(term),
    );
  }, [abcdeRows, abcdeSearch]);

  const topPageCount = Math.max(1, Math.ceil(filteredTopProductos.length / mobilePageSize));
  const abcdePageCount = Math.max(1, Math.ceil(filteredAbcdeRows.length / mobilePageSize));

  useEffect(() => {
    setTopPage((prev) => Math.min(prev, topPageCount));
  }, [topPageCount]);

  useEffect(() => {
    setAbcdePage((prev) => Math.min(prev, abcdePageCount));
  }, [abcdePageCount]);

  useEffect(() => {
    setTopPage(1);
  }, [topSearch, startDate, endDate]);

  useEffect(() => {
    setAbcdePage(1);
  }, [abcdeSearch, startDate, endDate]);

  const pagedTopProductos = useMemo(() => {
    const start = (topPage - 1) * mobilePageSize;
    return filteredTopProductos.slice(start, start + mobilePageSize);
  }, [filteredTopProductos, topPage]);

  const pagedAbcdeRows = useMemo(() => {
    const start = (abcdePage - 1) * mobilePageSize;
    return filteredAbcdeRows.slice(start, start + mobilePageSize);
  }, [filteredAbcdeRows, abcdePage]);

  return (
    <Stack spacing={1.5} sx={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography variant="h4" sx={{ mb: 0.1, fontSize: { xs: '1.4rem', sm: '1.9rem' } }}>
            Centro de Control
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.88rem', sm: '0.95rem' } }}>
            Panorama operativo, alertas clave y comportamiento diario del soporte.
          </Typography>
        </Box>
        <Box sx={{ px: 1.25, py: 0.75, borderRadius: 3, width: { xs: '100%', sm: 'auto' }, bgcolor: theme.palette.mode === 'dark' ? 'rgba(236,106,23,0.12)' : 'rgba(236,106,23,0.08)' }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'secondary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Resumen Ejecutivo
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 1.1, sm: 1.4 } }}>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(nextStart);
            setEndDate(nextEnd);
          }}
        />
      </Paper>

      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && metrics && (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 1.1,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(6, 1fr)' },
            }}
          >
            <KpiCard
              title="Total Items"
              value={metrics.totalItems.toLocaleString()}
            />
            <KpiCard
              title="Total Ventas/Soporte"
              value={metrics.totalVentasSoporte.toLocaleString()}
            />
            <KpiCard
              title="% A"
              value={`${metrics.porcentajeA}%`}
            />
            <KpiCard
              title="% B"
              value={`${metrics.porcentajeB}%`}
            />
            <KpiCard
              title="Alertas"
              value={metrics.alertas.toString()}
            />
            <KpiCard
              title="Cobertura"
              value={`${metrics.cobertura}%`}
            />
          </Box>

          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
            <Box>
              <Paper
                sx={{
                  p: 0,
                  height: { xs: 300, sm: 332 },
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  sx={{
                    p: { xs: 1.25, sm: 2 },
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.3rem' },
                      }}
                    >
                      Soporte Overview
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem' }}>
                      Evolucion diaria de soporte
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ px: { xs: 0.8, sm: 1.1 }, pt: { xs: 0.3, sm: 0.8 }, height: { xs: 206, sm: 236 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={supportByDay} margin={{ top: 8, right: isMobile ? 4 : 12, left: isMobile ? -12 : 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="supportGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={isDark ? 0.35 : 0.26} />
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={isDark ? 0.08 : 0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={isDark ? '#2f3540' : '#e8eef8'} vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value: string) => (isMobile ? dayjs(value).format('DD/MM') : dayjs(value).format('DD MMM'))}
                        minTickGap={isMobile ? 34 : 24}
                        interval="preserveStartEnd"
                        tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                        axisLine={{ stroke: theme.palette.divider }}
                        tickLine={false}
                      />
                      <YAxis
                        hide={isMobile}
                        domain={([dataMin, dataMax]: [number, number]) => [Math.max(0, dataMin - 80), dataMax + 80]}
                        tickCount={5}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <Tooltip
                        labelFormatter={(value: string) => dayjs(value).format('DD MMM, YYYY')}
                        formatter={(value: number) => [`${value}`, 'Soporte']}
                        contentStyle={{
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 10,
                          color: theme.palette.text.primary,
                          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                        }}
                        itemStyle={{ color: theme.palette.primary.main }}
                        labelStyle={{ color: theme.palette.text.primary, fontWeight: 700 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="soporte"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#supportGradient)"
                        dot={false}
                        activeDot={{ r: 5, stroke: theme.palette.background.paper, strokeWidth: 1.5, fill: theme.palette.primary.main }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
            <Box>
              <AlertsPanel alerts={alerts} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
            <Box>
              <Paper sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Productos populares
                </Typography>
                <TextField
                  size="small"
                  label="Buscar en productos"
                  value={topSearch}
                  onChange={(event) => setTopSearch(event.target.value)}
                  fullWidth
                  sx={{ mb: 1.5 }}
                />
                {isMobile ? (
                  <Stack spacing={1.2}>
                    {pagedTopProductos.map((row) => (
                      <MobileRecordCard
                        key={row.id}
                        rows={[
                          { label: 'Articulo', value: row.item },
                          { label: 'Soporte absoluto', value: row.soporte_absoluto },
                          { label: 'Soporte relativo', value: `${row.soporte_relativo}%` },
                          { label: 'Descripcion', value: row.description },
                        ]}
                      />
                    ))}
                    {topPageCount > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                        <Pagination
                          count={topPageCount}
                          page={topPage}
                          onChange={(_, page) => setTopPage(page)}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DataGrid
                      rows={filteredTopProductos}
                      columns={topColumns}
                      autoHeight
                      pageSizeOptions={[10]}
                      disableRowSelectionOnClick
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 10, page: 0 },
                        },
                      }}
                      sx={{
                        minWidth: 620,
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Box>
            <Box>
              <Paper sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Clasificacion ABCDE
                </Typography>
                <TextField
                  size="small"
                  label="Buscar en ABCDE"
                  value={abcdeSearch}
                  onChange={(event) => setAbcdeSearch(event.target.value)}
                  fullWidth
                  sx={{ mb: 1.5 }}
                />
                {isMobile ? (
                  <Stack spacing={1.2}>
                    {pagedAbcdeRows.map((row) => (
                      <MobileRecordCard
                        key={row.id}
                        rows={[
                          { label: 'Codigo', value: row.itemCode },
                          { label: 'Clase', value: row.abcde },
                        ]}
                      />
                    ))}
                    {abcdePageCount > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                        <Pagination
                          count={abcdePageCount}
                          page={abcdePage}
                          onChange={(_, page) => setAbcdePage(page)}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <DataGrid
                      rows={filteredAbcdeRows}
                      columns={abcdeColumns}
                      autoHeight
                      pageSizeOptions={[10]}
                      disableRowSelectionOnClick
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 10, page: 0 },
                        },
                      }}
                      sx={{
                        minWidth: 360,
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </>
      )}
    </Stack>
  );
};

export default Dashboard;
