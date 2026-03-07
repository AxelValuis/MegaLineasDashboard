import { Box, Typography } from '@mui/material';

const AppFooter = (): JSX.Element => (
  <Box
    component="footer"
    sx={{
      mt: 2.5,
      py: 1.5,
      textAlign: 'center',
    }}
  >
    <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.25, opacity: 0.9 }}>
      Derechos reservados - SDC Consulting
    </Typography>
  </Box>
);

export default AppFooter;
