import { Box, Divider, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface MobileField {
  label: string;
  value: ReactNode;
}

interface MobileRecordCardProps {
  title?: string;
  rows: MobileField[];
  footer?: ReactNode;
}

const MobileRecordCard = ({ title, rows, footer }: MobileRecordCardProps): JSX.Element => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      border: '1px solid #d8dee8',
      boxShadow: '0 2px 8px rgba(16, 24, 40, 0.08)',
    }}
  >
    {title && (
      <Typography sx={{ fontWeight: 700, color: '#49566b', mb: 1.2 }}>
        {title}
      </Typography>
    )}

    <Box sx={{ display: 'grid', gap: 0.9 }}>
      {rows.map((row, index) => (
        <Box key={`${row.label}-${index}`}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 1fr', gap: 1.5, alignItems: 'start' }}>
            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: 0.2, color: '#778296' }}>
              {row.label}
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', color: '#1f2a37', textAlign: 'right' }}>
              {row.value}
            </Typography>
          </Box>
          {index < rows.length - 1 && <Divider sx={{ mt: 0.9 }} />}
        </Box>
      ))}
    </Box>

    {footer && <Box sx={{ mt: 1.2 }}>{footer}</Box>}
  </Paper>
);

export default MobileRecordCard;
