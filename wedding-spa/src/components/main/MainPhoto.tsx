// components/main/MainPhoto.tsx
import React from 'react';
import {Box, Typography} from '@mui/material';

const MainPhoto: React.FC = () => {
  return (
      <Box sx={{position: 'relative', width: '100%', height: '600px'}}>
        <Box
            component="img"
            src="/assets/mainCoupleImage.jpeg"
            alt="Main Image"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 38%',
              filter: 'brightness(50%)',
            }}
        />
        <Typography
            variant="h3"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: '"Baskervville", serif',
              fontWeight: 800,
              color: 'var(--main-light)',
              fontSize: 'clamp(1em, 12vw + 1em, 15rem)',
            }}
        >
          09 . 13 . 2025
        </Typography>
      </Box>
  );
};

export default MainPhoto;
