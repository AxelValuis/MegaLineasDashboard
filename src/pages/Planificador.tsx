import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { fetchPlanificador } from '../api/endpoints';
import { planificadorMock } from '../api/mockData';
import type { PlanItem } from '../api/types';
import DateRangeFilter from '../components/DateRangeFilter';
import { defaultDateRange, toApiDate } from '../utils/date';
import { exportPlanificadorExcel } from '../utils/excel';

const planColumns: GridColDef<PlanItem>[] = [
  { field: 'fecha', headerName: 'Fecha', minWidth: 120, flex: 1 },
  { field: 'item', headerName: 'Articulo', minWidth: 120, flex: 1 },
  { field: 'producto', headerName: 'Producto', minWidth: 170, flex: 1.2 },
  { field: 'estado', headerName: 'Estado', minWidth: 130, flex: 1 },
  { field: 'responsable', headerName: 'Responsable', minWidth: 150, flex: 1 },
  { field: 'observacion', headerName: 'Observacion', minWidth: 200, flex: 1.5 },
];

const categories = Array.from(new Set(planificadorMock.map((row) => row.categoria)));

const Planificador = (): JSX.Element => {
  const initialRange = defaultDateRange();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({ start_date: toApiDate(startDate), end_date: toApiDate(endDate) }),
    [startDate, endDate],
  );

  const products = useMemo(() => {
    const source = category ? planificadorMock.filter((item) => item.categoria === category) : planificadorMock;
    return Array.from(new Set(source.map((item) => item.producto)));
  }, [category]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetchPlanificador(params, category || undefined, product || undefined)
      .then((data) => {
        if (active) {
          setRows(data);
        }
      })
      .catch(() => {
        if (active) {
          setError('No fue posible cargar la planificacion.');
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
  }, [params, category, product]);

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase();
    return rows.filter(
      (row) =>
        row.item.toLowerCase().includes(term) ||
        row.producto.toLowerCase().includes(term) ||
        row.responsable.toLowerCase().includes(term) ||
        row.estado.toLowerCase().includes(term),
    );
  }, [rows, search]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Planificador de Patching
      </Typography>

      <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '2fr 1fr 1fr auto' }, alignItems: 'start' }}>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart);
              setEndDate(nextEnd);
            }}
          />
          <TextField
            select
            label="Categoria"
            size="small"
            fullWidth
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setProduct('');
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Producto"
            size="small"
            fullWidth
            value={product}
            onChange={(event) => setProduct(event.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {products.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'stretch', lg: 'flex-end' } }}>
            <Button
              variant="contained"
              onClick={() =>
                void exportPlanificadorExcel(rows, {
                  startDate,
                  endDate,
                  category,
                  product,
                })
              }
              disabled={rows.length === 0}
              fullWidth
            >
              Descargar Excel
            </Button>
          </Box>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 180 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper sx={{ p: { xs: 1, sm: 2 } }}>
          <TextField
            size="small"
            label="Buscar en Planificador"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
            sx={{ mb: 1.5 }}
          />
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={filteredRows}
              columns={planColumns}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[10]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{ minWidth: 860 }}
            />
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export default Planificador;
