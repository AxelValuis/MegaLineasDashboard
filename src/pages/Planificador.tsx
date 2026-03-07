import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';
import { fetchPlanificador } from '../api/endpoints';
import { planificadorMock } from '../api/mockData';
import MobileRecordCard from '../components/MobileRecordCard';
import DateRangeFilter from '../components/DateRangeFilter';
import type { PlanItem } from '../api/types';
import { defaultDateRange, toApiDate } from '../utils/date';
import { exportPlanificadorExcel } from '../utils/excel';

const categories = Array.from(new Set(planificadorMock.map((row) => row.categoria)));

const statusColor: Record<PlanItem['estado'], 'warning' | 'info' | 'success'> = {
  Pendiente: 'warning',
  'En curso': 'info',
  Completado: 'success',
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const Planificador = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const initialRange = defaultDateRange();
  const mobilePageSize = 6;
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [search, setSearch] = useState('');
  const [mobilePage, setMobilePage] = useState(1);
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
        row.estado.toLowerCase().includes(term) ||
        row.observacion.toLowerCase().includes(term) ||
        row.categoria.toLowerCase().includes(term),
    );
  }, [rows, search]);

  const planColumns = useMemo<GridColDef<PlanItem>[]>(
    () => [
      {
        field: 'item',
        headerName: 'ID',
        minWidth: 120,
        flex: 0.8,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary' }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'producto',
        headerName: 'Tarea',
        minWidth: 220,
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 0.8, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              {params.row.producto}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {params.row.categoria}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'estado',
        headerName: 'Estado',
        minWidth: 140,
        flex: 0.9,
        renderCell: (params) => (
          <Chip size="small" label={params.value} color={statusColor[params.row.estado]} sx={{ fontWeight: 700, minWidth: 104 }} />
        ),
      },
      {
        field: 'responsable',
        headerName: 'Responsable',
        minWidth: 180,
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main', fontSize: '0.66rem', fontWeight: 700 }}>
              {getInitials(params.row.responsable)}
            </Avatar>
            <Typography sx={{ fontSize: '0.86rem' }}>{params.row.responsable}</Typography>
          </Box>
        ),
      },
      {
        field: 'observacion',
        headerName: 'Observacion',
        minWidth: 260,
        flex: 1.4,
        renderCell: (params) => (
          <Typography
            sx={{
              fontSize: '0.84rem',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {params.row.observacion}
          </Typography>
        ),
      },
      {
        field: 'acciones',
        headerName: 'Acciones',
        minWidth: 92,
        sortable: false,
        filterable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: () => (
          <IconButton size="small" color="inherit">
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [],
  );

  const mobilePageCount = Math.max(1, Math.ceil(filteredRows.length / mobilePageSize));

  useEffect(() => {
    setMobilePage((prev) => Math.min(prev, mobilePageCount));
  }, [mobilePageCount]);

  useEffect(() => {
    setMobilePage(1);
  }, [search, category, product, startDate, endDate]);

  const pagedRows = useMemo(() => {
    const start = (mobilePage - 1) * mobilePageSize;
    return filteredRows.slice(start, start + mobilePageSize);
  }, [filteredRows, mobilePage]);

  const resetFilters = (): void => {
    const initial = defaultDateRange();
    setStartDate(initial.startDate);
    setEndDate(initial.endDate);
    setCategory('');
    setProduct('');
    setSearch('');
  };

  return (
    <Stack spacing={2.2} sx={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap' }}>
        <Stack spacing={0.2} sx={{ maxWidth: 720 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.secondary', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '0.82rem' }}>Inicio</Typography>
            <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: '0.82rem', color: 'text.primary', fontWeight: 700 }}>Planificador</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', sm: '2rem' }, lineHeight: 1.05 }}>
            Planificador de Patching
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.88rem', sm: '0.93rem' } }}>
            Gestiona y monitorea cronogramas de trabajo y responsables operativos.
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
          <IconButton sx={{ border: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
            <NotificationsNoneRoundedIcon fontSize="small" />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadRoundedIcon />}
            fullWidth={isMobile}
            onClick={() =>
              void exportPlanificadorExcel(filteredRows, {
                startDate,
                endDate,
                category,
                product,
              })
            }
            disabled={filteredRows.length === 0}
          >
            Exportar a Excel
          </Button>
        </Box>
      </Box>

      <Paper
        sx={{
          p: { xs: 1.25, sm: 2 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1.2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr',
              lg: '1.4fr 1fr 1fr 1.2fr auto',
            },
            alignItems: 'end',
          }}
        >
          <TextField
            label="Buscar producto"
            size="small"
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ID, nombre o referencia..."
            InputProps={{
              startAdornment: <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.8 }} />,
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
            <MenuItem value="">Todas las categorias</MenuItem>
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
            <MenuItem value="">Todos los productos</MenuItem>
            {products.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart);
              setEndDate(nextEnd);
            }}
          />

          <IconButton
            onClick={resetFilters}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 40,
              width: { xs: '100%', lg: 40 },
            }}
            aria-label="limpiar filtros"
          >
            <TuneRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 180 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
          }}
        >
          {isMobile ? (
            <Stack spacing={1.2} sx={{ p: 1.2 }}>
              {pagedRows.map((row, index) => (
                <MobileRecordCard
                  key={row.id}
                  title={`N. ${(mobilePage - 1) * mobilePageSize + index + 1}`}
                  rows={[
                    { label: 'ID', value: row.item },
                    { label: 'Producto', value: row.producto },
                    { label: 'Estado', value: <Chip size="small" label={row.estado} color={statusColor[row.estado]} /> },
                    { label: 'Responsable', value: row.responsable },
                    { label: 'Observacion', value: row.observacion },
                    { label: 'Categoria', value: row.categoria },
                    { label: 'Fecha', value: row.fecha },
                  ]}
                />
              ))}
              {mobilePageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                  <Pagination count={mobilePageCount} page={mobilePage} onChange={(_, page) => setMobilePage(page)} size="small" color="primary" />
                </Box>
              )}
            </Stack>
          ) : (
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
                sx={{
                  minWidth: 900,
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    letterSpacing: 0.35,
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 0.5,
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fbff',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    minHeight: 52,
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      )}
    </Stack>
  );
};

export default Planificador;
