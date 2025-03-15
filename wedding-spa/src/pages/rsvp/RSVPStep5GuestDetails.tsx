import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import StepLayout from './RSVPStepLayout';
import { Rsvp } from '../../types/rsvp';

interface RsvpGuestDetailsStepProps {
  rsvp: Rsvp;
  onNext: () => void;
  onBack: () => void;
}

const RsvpGuestDetailsStep: React.FC<RsvpGuestDetailsStepProps> = ({ rsvp, onNext, onBack }) => (
    <StepLayout title="Guest Details" description="Review and update your guest details as needed.">
      <Box textAlign="center">
        <Typography variant="body1">
          {/* Placeholder for your guest editor component */}
          Guest details editing component goes here.
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" onClick={onNext}>
            Next
          </Button>
        </Box>
      </Box>
    </StepLayout>
);

export default RsvpGuestDetailsStep;
