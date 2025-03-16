// pages/rsvp/RSVPStep7ThankYou.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import StepLayout from './RSVPStepLayout';

const ThankYouStep: React.FC = () => (
    <StepLayout title="Thank You!" description="We appreciate your response.">
      <Box textAlign="center">
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your RSVP has been submitted.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Return Home
        </Button>
      </Box>
    </StepLayout>
);

export default ThankYouStep;
