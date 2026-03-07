import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useTheme } from '@mui/material/styles';

interface KpiCardProps {
  title: string;
  value: string;
  accentColor?: string;
}

const KpiCard = ({ title, value, accentColor = '#1f2a37' }: KpiCardProps): JSX.Element => {
  const theme = useTheme();
  const valueColor = accentColor === '#1f2a37' ? theme.palette.text.primary : accentColor;

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 180,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 3, sm: 2.5 },
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: { xs: '0 12px 28px rgba(16, 24, 40, 0.08)', sm: '0 12px 28px rgba(16, 24, 40, 0.05)' },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(1,67,133,0.18), transparent 48%)'
            : 'linear-gradient(135deg, rgba(1,67,133,0.08), transparent 48%)',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 1.6, sm: 1.85 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.7, color: 'secondary.main' }}>
              <TrendingUpRoundedIcon sx={{ fontSize: 15 }} />
              <Typography sx={{ fontSize: '0.74rem', fontWeight: 700 }}>
                Actualizado
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}>
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          sx={{
            mt: { xs: 0.85, sm: 1.1 },
            fontSize: { xs: '1.85rem', sm: '2.05rem' },
            lineHeight: 1.15,
            fontWeight: { xs: 900, sm: 800 },
            color: valueColor,
            letterSpacing: '-0.04em',
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
