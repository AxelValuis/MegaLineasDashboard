import { Chip, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
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
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Alertas
    </Typography>
    <List dense>
      {alerts.map((alert) => (
        <ListItem key={alert.id} divider>
          <ListItemText primary={alert.message} />
          <Chip size="small" color={colorBySeverity[alert.severity]} label={alert.severity} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default AlertsPanel;
