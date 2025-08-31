// components/main/headerComponents/Footer.tsx
import React from 'react';
import {Box, Container, Link, Typography} from '@mui/material';

const WeddingFooter: React.FC = () => {
  return (
      <Box component="footer">
        <Container maxWidth="sm">
          {/* Initials */}
          <Typography variant="h5" align="center" color="primary">
            <Link
                href="https://drive.google.com/drive/u/1/folders/1tiUegIGQp6iqCG9sVu3L-FbLrL338HdV"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
                sx={{
                  textDecorationThickness: '2px',
                  // keep the link visually consistent
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineOffset: '2px',
                  },
                }}
                aria-label="Open Kevin's drive folder"
            >
              K
            </Link>{' '}
            &amp; O
          </Typography>

          {/* Horizontal Line */}
          <Box
              sx={{
                height: '2px',
                width: '20%',
                bgcolor: 'primary.light',
                mx: 'auto',
              }}
          />

          {/* Wedding Date */}
          <Typography variant="body1" align="center">
            9 . 13. 2025
          </Typography>
        </Container>
      </Box>
  );
};

export default WeddingFooter;
