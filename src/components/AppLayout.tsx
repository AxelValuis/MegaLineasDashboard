import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
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
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../auth/authStorage';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Planificador', path: '/planificador' },
  { label: 'Productos / ABCDE', path: '/productos' },
];

const AppLayout = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div>
      <Toolbar sx={{ py: 1.5 }}>
        <Box sx={{ width: '100%' }}>
          <Box
            component="img"
            src="/logo-megalineas.png"
            alt="Megalineas"
            sx={{ maxWidth: 180, width: '100%', height: 'auto', display: 'block', mb: 1 }}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="subtitle1" fontWeight={800} color="primary.main">
            MEGALINEAS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#ffffff', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#1f2a37',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: { xs: 64, sm: 72 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((prev) => !prev)} sx={{ display: { md: 'none' } }} aria-label="abrir menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ maxWidth: { xs: 170, sm: 280, md: 'none' }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {pageTitle}
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" size="small" onClick={handleLogout}>
            Cerrar sesion
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: '78vw', maxWidth: 300 } }}
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
              borderRight: '2px solid #d9e1eb',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.2, sm: 2, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` }, bgcolor: '#ffffff' }}>
        <Toolbar />
        <Box
          sx={{
            maxWidth: { xs: 460, md: 'none' },
            mx: { xs: 'auto', md: 0 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
