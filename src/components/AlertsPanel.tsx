import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import { Box, Chip, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import type { AlertItem } from '../api/types';

interface AlertsPanelProps {
  alerts: AlertItem[];
}

const colorBySeverity: Record<AlertItem['severity'], 'error' | 'warning' | 'success'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'success',
};

const AlertsPanel = ({ alerts }: AlertsPanelProps): JSX.Element => (
  <Paper sx={{ p: 2.2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Box>
        <Typography variant="h6">Alertas</Typography>
        <Typography sx={{ fontSize: '0.84rem', color: 'text.secondary' }}>
          Seguimiento de incidencias operativas
        </Typography>
      </Box>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2.5,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'secondary.main',
          color: '#fff',
          boxShadow: '0 12px 24px rgba(236, 106, 23, 0.22)',
        }}
      >
        <NotificationsActiveRoundedIcon fontSize="small" />
      </Box>
    </Box>
    <List dense sx={{ py: 0.5 }}>
      {alerts.map((alert) => (
        <ListItem key={alert.id} divider sx={{ px: 0, py: 1.15, alignItems: 'flex-start' }}>
          <ListItemText
            primary={alert.message}
            primaryTypographyProps={{ sx: { fontSize: '0.9rem', color: 'text.primary', lineHeight: 1.35 } }}
          />
          <Chip size="small" color={colorBySeverity[alert.severity]} label={alert.severity} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default AlertsPanel;
