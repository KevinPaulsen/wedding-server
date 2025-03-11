import React from 'react';
import {Box, Container, Typography} from '@mui/material';

const WeddingFooter: React.FC = () => {
  return (
      <Box component="footer">
        <Container maxWidth="sm">
          {/* Initials */}
          <Typography
              variant="h5"
              align="center"
              color="primary"
          >
            K & O
          </Typography>

          {/* Horizontal Line */}
          <Box
              sx={{
                height: "2px",
                width: '20%',
                bgcolor: 'primary.light',
                mx: 'auto',
              }}
          />

          {/* Wedding Date */}
          <Typography
              variant="body1"
              align="center"
          >
            9 . 13. 2025
          </Typography>
        </Container>
      </Box>
  );
};

export default WeddingFooter;
