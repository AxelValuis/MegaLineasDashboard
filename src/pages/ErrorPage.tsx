import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/authStorage';

const ErrorPage = (): JSX.Element => {
  const authenticated = isAuthenticated();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#eef1f5',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 920, alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 560, height: { xs: 250, sm: 320 } }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              bgcolor: '#d5dce6',
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
              bgcolor: '#1f2f4a',
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
                  bgcolor: '#d7dde8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                }}
              >
                <Box sx={{ width: 56, height: 6, borderRadius: 4, bgcolor: '#5a59e6' }} />
                <Box sx={{ width: 32, height: 8, borderRadius: 4, bgcolor: '#5a59e6' }} />
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
              color: '#2f466b',
            }}
          />
        </Box>

        <Typography variant="h2" fontWeight={800} sx={{ color: '#13233e', fontSize: { xs: '2rem', sm: '3rem' } }}>
          Pagina en mantenimiento
        </Typography>
        <Typography variant="h6" sx={{ color: '#5a6f8e', fontWeight: 400, maxWidth: 720 }}>
          Estamos realizando ajustes programados. Vuelve a intentarlo en unos minutos.
        </Typography>
        <Button
          component={Link}
          to={authenticated ? '/dashboard' : '/login'}
          variant="contained"
          size="large"
          sx={{ minWidth: 220 }}
        >
          {authenticated ? 'Volver al Dashboard' : 'Ir a iniciar sesion'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ErrorPage;
