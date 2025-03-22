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
            <Box sx={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
            }}>
                  <Typography
                      variant="h3"
                      sx={{
                            fontFamily: '"Baskervville", serif',
                            color: (theme) => theme.palette.primary.contrastText,
                            fontSize: 'clamp(1em, 12vw + 1em, 15rem)',
                      }}
                  >
                        09 . 13 . 2025
                  </Typography>
                  <Typography
                      variant="h3"
                      sx={{
                            color: (theme) => theme.palette.primary.contrastText,
                            fontSize: 'clamp(1em, 3vw + 1em, 15rem)',
                      }}
                  >
                        SEATTLE, WA
                  </Typography>
            </Box>
      </Box>
  );
};

export default MainPhoto;
