// components/main/rsvpFlow/RSVPStep7ThankYou.tsx
import React from 'react';
import {Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import StepLayout from './RSVPStepLayout';
import CustomButton from "../../shared/CustomButton";

const ThankYouStep: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StepLayout title="Thank You!" description="Thank you for submitting your RSVP! You may redo this form at any time to make changes. If you have any questions or concerns, please contact Kevin or Olivia.">
      <Box textAlign="center">
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your RSVP has been submitted.
        </Typography>
        <CustomButton text="Return Home" onClick={() => navigate('/')} width="auto" variant="dark"/>
      </Box>
    </StepLayout>
    )
};

export default ThankYouStep;
