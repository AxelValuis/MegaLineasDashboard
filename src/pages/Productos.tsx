import { Alert, Box, CircularProgress, MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { fetchAbcde, fetchTopProductos } from '../api/endpoints';
import type { AbcdeLetter, AbcdeRow, TopProductoRow } from '../api/types';
import DateRangeFilter from '../components/DateRangeFilter';
import { defaultDateRange, toApiDate } from '../utils/date';

const topColumns: GridColDef<TopProductoRow>[] = [
  { field: 'item', headerName: 'Articulo', flex: 1, minWidth: 120 },
  { field: 'soporte_absoluto', headerName: 'Soporte absoluto', flex: 1, minWidth: 140 },
  { field: 'soporte_relativo', headerName: 'Soporte relativo (%)', flex: 1, minWidth: 140 },
  { field: 'description', headerName: 'Descripcion', flex: 1.6, minWidth: 220 },
];

const abcdeColumns: GridColDef<AbcdeRow>[] = [
  { field: 'itemCode', headerName: 'Codigo', flex: 1, minWidth: 180 },
  { field: 'abcde', headerName: 'ABCDE', flex: 1, minWidth: 120 },
];

const Productos = (): JSX.Element => {
  const initialRange = defaultDateRange();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [tab, setTab] = useState(0);
  const [topSearch, setTopSearch] = useState('');
  const [abcdeSearch, setAbcdeSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState('');
  const [topRows, setTopRows] = useState<TopProductoRow[]>([]);
  const [abcdeRows, setAbcdeRows] = useState<AbcdeRow[]>([]);
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
      fetchTopProductos(params),
      fetchAbcde(params, letterFilter ? (letterFilter as AbcdeLetter) : undefined),
    ])
      .then(([nextTop, nextAbcde]) => {
        if (active) {
          setTopRows(nextTop);
          setAbcdeRows(nextAbcde);
        }
      })
      .catch(() => {
        if (active) {
          setError('No fue posible cargar productos.');
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
  }, [params, letterFilter]);

  const filteredTop = useMemo(() => {
    const term = topSearch.toLowerCase();
    return topRows.filter(
      (row) => row.item.toLowerCase().includes(term) || row.description.toLowerCase().includes(term),
    );
  }, [topSearch, topRows]);

  const filteredAbcde = useMemo(() => {
    const term = abcdeSearch.toLowerCase();
    return abcdeRows.filter((row) => row.itemCode.toLowerCase().includes(term) || row.abcde.toLowerCase().includes(term));
  }, [abcdeRows, abcdeSearch]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Productos / Clasificacion ABCDE
      </Typography>

      <Paper sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: tab === 1 ? '2fr 1.2fr 0.8fr' : '2fr 1.2fr' } }}>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart);
              setEndDate(nextEnd);
            }}
          />
          <TextField
            label={tab === 0 ? 'Buscar en productos principales' : 'Buscar en ABCDE'}
            size="small"
            value={tab === 0 ? topSearch : abcdeSearch}
            onChange={(event) => {
              if (tab === 0) {
                setTopSearch(event.target.value);
              } else {
                setAbcdeSearch(event.target.value);
              }
            }}
            fullWidth
          />
          {tab === 1 && (
            <TextField
              select
              label="Filtro letra"
              size="small"
              value={letterFilter}
              onChange={(event) => setLetterFilter(event.target.value)}
              fullWidth
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="E">E</MenuItem>
            </TextField>
          )}
        </Box>
      </Paper>

      <Paper>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab label="Productos principales" />
          <Tab label="ABCDE" />
        </Tabs>
      </Paper>

      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 160 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper sx={{ p: { xs: 1, sm: 2 } }}>
          {tab === 0 ? (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                rows={filteredTop}
                columns={topColumns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[10]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                sx={{ minWidth: 620 }}
              />
            </Box>
          ) : (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <DataGrid
                rows={filteredAbcde}
                columns={abcdeColumns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[10]}
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
      )}
    </Stack>
  );
};

export default Productos;
