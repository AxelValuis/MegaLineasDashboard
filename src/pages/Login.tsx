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
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../auth/authStorage';

const Login = (): JSX.Element => {
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
      }}
    >
      <Box
        sx={{
          bgcolor: '#f4f6fb',
          display: 'grid',
          placeItems: 'center',
          p: { xs: 2.5, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
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
          <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5, color: '#13233e', fontSize: { xs: '2rem', sm: '2.35rem' } }}>
            Iniciar sesion
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: '#53627a' }}>
            Acceso al panel de Megalineas
          </Typography>
          <Stack component="form" spacing={2} onSubmit={handleLogin}>
            {error && <Alert severity="error">{error}</Alert>}
            <Alert
              severity="info"
              sx={{
                border: '1px solid #a6c3ff',
                bgcolor: '#edf3ff',
                '& .MuiAlert-message': { color: '#23457f' },
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
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          color: 'white',
          backgroundColor: '#172744',
          backgroundImage:
            'radial-gradient(circle at 12% 4%, rgba(255,255,255,0.08) 0 220px, transparent 221px), radial-gradient(circle at 96% 96%, rgba(255,255,255,0.06) 0 280px, transparent 281px), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0 420px, transparent 421px)',
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.05, mb: 2, fontSize: '3.2rem' }}>
           MEGALINEAS
            <br />
        
          </Typography>
          <Typography variant="h6" sx={{ color: '#c7d3e8', fontWeight: 400, mb: 4 }}>
            Gestiona planeacion, productos y clasificacion ABCDE en un solo dashboard empresarial.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
