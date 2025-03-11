// components/ComingSoon.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ComingSoon: React.FC = () => {
  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            px: 2,
          }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Coming Soon!
        </Typography>
        <Typography variant="h6" component="p">
          Please check back soon for updates.
        </Typography>
      </Box>
  );
};

export default ComingSoon;
