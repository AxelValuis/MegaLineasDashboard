import { Alert, Box, CircularProgress, Pagination, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
    <Stack spacing={2} sx={{ maxWidth: { xs: 440, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
      <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
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
              gap: 1.5,
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

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
            <Box>
              <Paper sx={{ p: 2, height: 320 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Soporte por dia
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={supportByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="soporte" stroke="#0b5cab" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
            <Box>
              <AlertsPanel alerts={alerts} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
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
                      sx={{ minWidth: 620 }}
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
                      sx={{ minWidth: 360 }}
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
