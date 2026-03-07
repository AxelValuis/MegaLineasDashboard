import MenuIcon from '@mui/icons-material/Menu';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../auth/authStorage';
import { useColorMode } from '../theme/colorMode';
import AppFooter from './AppFooter';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon fontSize="small" /> },
  { label: 'Planificador', path: '/planificador', icon: <CalendarMonthRoundedIcon fontSize="small" /> },
  { label: 'Productos / ABCDE', path: '/productos', icon: <Inventory2RoundedIcon fontSize="small" /> },
];

const AppLayout = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = useMemo(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.path));
    return current?.label ?? 'Dashboard';
  }, [location.pathname]);

  const handleLogout = (): void => {
    clearAuthToken();
    navigate('/login', { replace: true });
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: '#f7fbff',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #08111f 0%, #091729 54%, #07101c 100%)'
          : 'linear-gradient(180deg, #07162e 0%, #092247 52%, #06152b 100%)',
      }}
    >
      <Toolbar sx={{ py: 2.5, px: 2.5 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #ec6a17 0%, #ff8a3d 100%)',
                boxShadow: '0 14px 28px rgba(236, 106, 23, 0.28)',
              }}
            >
              <CalendarMonthRoundedIcon sx={{ color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={900} sx={{ color: '#ffffff', lineHeight: 1 }}>
                MEGALINEAS
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(214, 228, 255, 0.68)' }}>
                Centro de gestion
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ px: 1.8, py: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => setMobileOpen(false)}
            sx={{
              px: 1.6,
              py: 1.1,
              color: 'rgba(222, 234, 255, 0.72)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.07)',
                color: '#ffffff',
              },
              '&.Mui-selected': {
                color: '#ffffff',
                background: 'linear-gradient(135deg, #ec6a17 0%, #ff7f2d 100%)',
                boxShadow: '0 14px 28px rgba(236, 106, 23, 0.24)',
              },
              '&.Mui-selected:hover': {
                background: 'linear-gradient(135deg, #ec6a17 0%, #ff7f2d 100%)',
              },
            }}
          >
            <Box sx={{ mr: 1.25, display: 'inline-flex' }}>{item.icon}</Box>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', px: 2, py: 2.2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.1,
            px: 0.6,
            py: 0.8,
            borderRadius: 2.5,
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              bgcolor: '#9ac7b2',
              color: '#0c2135',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            A
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.15 }}>
              Admin User
            </Typography>
            <Typography sx={{ fontSize: '0.66rem', color: 'rgba(214, 228, 255, 0.62)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              admin@megalineas.com
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: 'rgba(214, 228, 255, 0.72)' }}
            aria-label="cerrar sesion"
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 27, 44, 0.72)' : 'rgba(255,255,255,0.78)',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: { xs: 64, sm: 72 },
            gap: 1.25,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            py: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((prev) => !prev)} sx={{ display: { md: 'none' } }} aria-label="abrir menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ maxWidth: { xs: 170, sm: 280, md: 'none' }, fontSize: { xs: '0.98rem', sm: '1.2rem' }, fontWeight: 800 }}>
              {pageTitle}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
            <IconButton color="inherit" onClick={toggleMode} aria-label="cambiar tema" sx={{ border: '1px solid', borderColor: 'divider' }}>
              {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
            <Button variant="outlined" color="primary" size="small" onClick={handleLogout}>
              Cerrar sesion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: '78vw', maxWidth: 300, borderRight: 'none', backgroundImage: 'none' } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              backgroundImage: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 1.5, md: 2 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(34, 82, 138, 0.18), transparent 28%), radial-gradient(circle at 10% 20%, rgba(236, 106, 23, 0.08), transparent 24%)'
            : 'radial-gradient(circle at top right, rgba(1, 67, 133, 0.08), transparent 24%), radial-gradient(circle at 0% 30%, rgba(236, 106, 23, 0.06), transparent 22%)',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            maxWidth: { xs: 520, md: 1600 },
            mx: 'auto',
            px: { xs: 0.5, sm: 0 },
          }}
        >
          <Outlet />
        </Box>
        <AppFooter />
      </Box>
    </Box>
  );
};

export default AppLayout;
