// pages/rsvp/RSVPStepLayout.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export interface StepLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const StepLayout: React.FC<StepLayoutProps> = ({ title, description, children }) => (
    <Box width="100%" maxWidth={500}>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      {description && (
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            {description}
          </Typography>
      )}
      {children}
    </Box>
);

export default StepLayout;
