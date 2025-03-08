import React from 'react';
import {Box, Container, Typography} from '@mui/material';

const WeddingFooter: React.FC = () => {
  return (
      <Box
          component="footer"
          sx={{
            py: 1,
          }}
      >
        <Container maxWidth="sm">
          {/* Initials */}
          <Typography
              variant="h3"
              align="center"
              color="primary"
          >
            K & O
          </Typography>

          {/* Horizontal Line */}
          <Box
              sx={{
                height: "2px",
                width: '40%',
                bgcolor: 'primary.light',
                mx: 'auto',
              }}
          />

          {/* Wedding Date */}
          <Typography
              variant="h5"
              align="center"
          >
            9 . 13. 2025
          </Typography>
        </Container>
      </Box>
  );
};

export default WeddingFooter;
