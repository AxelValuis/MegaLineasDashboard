import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/authStorage';
import AppFooter from '../components/AppFooter';

const ErrorPage = (): JSX.Element => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const authenticated = isAuthenticated();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 2,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 920, alignItems: 'center', textAlign: 'center', mx: 'auto', pt: 5 }}>
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 560, height: { xs: 250, sm: 320 } }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              bgcolor: isDark ? '#3a404a' : '#d5dce6',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '12%', sm: '8%' },
              bottom: 24,
              width: { xs: 170, sm: 210 },
              height: { xs: 170, sm: 210 },
              borderRadius: 4,
              bgcolor: isDark ? '#23262d' : theme.palette.primary.main,
              transform: 'rotate(-6deg)',
              boxShadow: 2,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '6%', sm: '8%' },
              bottom: 0,
              width: { xs: 210, sm: 250 },
              display: 'grid',
              gap: 1,
            }}
          >
            {[0, 1, 2].map((row) => (
              <Box
                key={row}
                sx={{
                  height: { xs: 56, sm: 70 },
                  borderRadius: 1.5,
                  bgcolor: isDark ? '#2b313b' : '#d7dde8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                }}
              >
                <Box sx={{ width: 56, height: 6, borderRadius: 4, bgcolor: theme.palette.primary.main }} />
                <Box sx={{ width: 32, height: 8, borderRadius: 4, bgcolor: theme.palette.primary.main }} />
              </Box>
            ))}
          </Box>
          <BuildCircleOutlinedIcon
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 18 },
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: { xs: 60, sm: 74 },
              color: isDark ? '#aab5c8' : theme.palette.primary.main,
            }}
          />
        </Box>

        <Typography variant="h2" fontWeight={800} sx={{ color: 'text.primary', fontSize: { xs: '2rem', sm: '3rem' } }}>
          Pagina en mantenimiento
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 720 }}>
          Estamos realizando ajustes programados. Vuelve a intentarlo en unos minutos.
        </Typography>
        <Button
          component={Link}
          to={authenticated ? '/dashboard' : '/login'}
          variant="contained"
          size="large"
          sx={{ minWidth: 220, bgcolor: theme.palette.primary.main }}
        >
          {authenticated ? 'Volver al Dashboard' : 'Ir a iniciar sesion'}
        </Button>
      </Stack>
      <AppFooter />
    </Box>
  );
};

export default ErrorPage;
