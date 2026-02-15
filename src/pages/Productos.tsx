import { Alert, Box, CircularProgress, MenuItem, Pagination, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';
import { fetchAbcde, fetchTopProductos } from '../api/endpoints';
import MobileRecordCard from '../components/MobileRecordCard';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mobilePageSize = 6;
  const initialRange = defaultDateRange();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [tab, setTab] = useState(0);
  const [topSearch, setTopSearch] = useState('');
  const [abcdeSearch, setAbcdeSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState('');
  const [topPage, setTopPage] = useState(1);
  const [abcdePage, setAbcdePage] = useState(1);
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

  const topPageCount = Math.max(1, Math.ceil(filteredTop.length / mobilePageSize));
  const abcdePageCount = Math.max(1, Math.ceil(filteredAbcde.length / mobilePageSize));

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
  }, [abcdeSearch, letterFilter, startDate, endDate, tab]);

  const pagedTopRows = useMemo(() => {
    const start = (topPage - 1) * mobilePageSize;
    return filteredTop.slice(start, start + mobilePageSize);
  }, [filteredTop, topPage]);

  const pagedAbcdeRows = useMemo(() => {
    const start = (abcdePage - 1) * mobilePageSize;
    return filteredAbcde.slice(start, start + mobilePageSize);
  }, [filteredAbcde, abcdePage]);

  return (
    <Stack spacing={2} sx={{ maxWidth: { xs: 440, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
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
            isMobile ? (
              <Stack spacing={1.2}>
                {pagedTopRows.map((row) => (
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
            )
          ) : (
            isMobile ? (
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
            )
          )}
        </Paper>
      )}
    </Stack>
  );
};

export default Productos;
