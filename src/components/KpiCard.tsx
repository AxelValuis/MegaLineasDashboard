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
      borderRadius: 2.5,
      border: '1px solid #d8dfeb',
      bgcolor: '#ffffff',
    }}
  >
    <CardContent sx={{ p: 2.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#1f2a37' }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: '#6f7e95' }}>
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        sx={{
          mt: 0.8,
          fontSize: { xs: '2rem', sm: '2.2rem' },
          lineHeight: 1.15,
          fontWeight: 700,
          color: accentColor,
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default KpiCard;
