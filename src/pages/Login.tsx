import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../auth/authStorage';
import AppFooter from '../components/AppFooter';

const Login = (): JSX.Element => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [user, setUser] = useState('admi');
  const [password, setPassword] = useState('admi123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (user === 'admi' && password === 'admi123') {
      setAuthToken('mock-jwt-token-admin');
      navigate('/dashboard', { replace: true });
      return;
    }
    setError('Credenciales invalidas. Usa admi / admi123.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gridTemplateRows: '1fr auto',
      }}
    >
      <Box
        sx={{
          gridColumn: { xs: '1', md: '1' },
          gridRow: '1',
          bgcolor: 'background.default',
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(1,67,133,0.15), transparent 28%)'
            : 'radial-gradient(circle at top left, rgba(1,67,133,0.08), transparent 26%)',
          display: 'grid',
          placeItems: 'center',
          p: { xs: 2.5, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 0, md: 1 },
          }}
        >
          <Box
            component="img"
            src="/logo-megalineas.png"
            alt="Megalineas"
            sx={{
              width: '100%',
              maxWidth: { xs: 230, sm: 260 },
              height: 'auto',
              display: 'block',
              mb: 3,
              mx: 'auto',
              objectFit: 'contain',
            }}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5, color: 'text.primary', fontSize: { xs: '2rem', sm: '2.35rem' } }}>
            Iniciar sesion
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
            Acceso al panel de gestion y analitica de Megalineas
          </Typography>
          <Stack component="form" spacing={2} onSubmit={handleLogin}>
            {error && <Alert severity="error">{error}</Alert>}
            <Alert
              severity="info"
              sx={{
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDark ? 0.55 : 0.35),
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
                '& .MuiAlert-message': { color: theme.palette.primary.main },
              }}
            >
              Usa credenciales demo: <b>admi / admi123</b>
            </Alert>
            <TextField label="Usuario" value={user} onChange={(event) => setUser(event.target.value)} required fullWidth />
            <TextField
              label="Contrasena"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)} aria-label="mostrar contrasena">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large">
              Ingresar
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          gridColumn: { md: '2' },
          gridRow: '1',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          color: 'white',
          backgroundColor: isDark ? '#090a0d' : theme.palette.primary.main,
          backgroundImage:
            'radial-gradient(circle at 12% 4%, rgba(255,255,255,0.08) 0 220px, transparent 221px), radial-gradient(circle at 96% 96%, rgba(255,255,255,0.06) 0 280px, transparent 281px), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0 420px, transparent 421px), linear-gradient(140deg, rgba(236,106,23,0.12), transparent 45%)',
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Typography sx={{ fontSize: '0.78rem', letterSpacing: 0.55, fontWeight: 800, textTransform: 'uppercase', color: alpha('#ffffff', 0.72), mb: 1.4 }}>
            Plataforma Empresarial
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.05, mb: 2, fontSize: '3.2rem' }}>
            MEGALINEAS
          </Typography>
          <Typography variant="h6" sx={{ color: alpha('#ffffff', isDark ? 0.78 : 0.82), fontWeight: 400, mb: 4 }}>
            Gestiona planeacion, productos y clasificacion ABCDE en un solo dashboard empresarial.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, gridRow: '2', bgcolor: 'background.default' }}>
        <AppFooter />
      </Box>
    </Box>
  );
};

export default Login;
