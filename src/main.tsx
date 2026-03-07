import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, type PaletteMode } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { createAppTheme } from './theme/appTheme';
import { ColorModeContext } from './theme/colorMode';
import 'dayjs/locale/es';

const STORAGE_KEY = 'megalineas-ui-mode';

const App = (): JSX.Element => {
  const [mode, setMode] = React.useState<PaletteMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  });

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  const colorMode = React.useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((prev) => {
          const nextMode: PaletteMode = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem(STORAGE_KEY, nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <CssBaseline />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
