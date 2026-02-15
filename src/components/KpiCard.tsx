import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string;
  accentColor?: string;
}

const KpiCard = ({ title, value, accentColor = '#1f2a37' }: KpiCardProps): JSX.Element => (
  <Card
    elevation={0}
    sx={{
      minWidth: 180,
      borderRadius: { xs: 3, sm: 2.5 },
      border: '1px solid #d8dfeb',
      bgcolor: '#ffffff',
      boxShadow: { xs: '0 2px 10px rgba(16, 24, 40, 0.08)', sm: 'none' },
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '0.98rem', sm: '1rem' }, fontWeight: 600, color: '#1f2a37' }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: '#6f7e95', display: { xs: 'none', sm: 'inline-flex' } }}>
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        sx={{
          mt: { xs: 0.2, sm: 0.8 },
          fontSize: { xs: '2.2rem', sm: '2.2rem' },
          lineHeight: 1.15,
          fontWeight: { xs: 800, sm: 700 },
          color: accentColor,
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default KpiCard;
