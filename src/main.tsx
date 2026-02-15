import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f4f8a' },
    secondary: { main: '#d32f2f' },
    background: { default: '#f1f4f8', paper: '#ffffff' },
    text: { primary: '#1f2a37', secondary: '#5f6b7a' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '3px solid #d32f2f',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          fontWeight: 700,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
