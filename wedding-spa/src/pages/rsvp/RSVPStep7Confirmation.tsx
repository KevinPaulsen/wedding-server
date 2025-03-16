// pages/rsvp/RSVPStep7Confirmation.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import StepLayout from './RSVPStepLayout';
import { FormData } from './RsvpFlowPage';

interface ConfirmationStepProps {
  formData: FormData;
  onNext: () => void;
  onBack: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, onNext, onBack }) => (
    <StepLayout
        title="Confirm Your RSVP"
        description="Please review your RSVP details before submitting."
    >
      <Box textAlign="center">
        <Typography variant="subtitle1">
          Name: {formData.first_name} {formData.last_name}
        </Typography>
        {formData.selectedRsvpId && (
            <Typography variant="subtitle1">RSVP ID: {formData.selectedRsvpId}</Typography>
        )}
        <Typography variant="subtitle1">
          Primary Contact: {formData.primary_contact_name}
        </Typography>
        <Typography variant="subtitle1">
          Email: {formData.primary_contact_email}
        </Typography>
        <Typography variant="subtitle1">
          Phone: {formData.primary_contact_phone}
        </Typography>
        <Typography variant="subtitle1">
          Address: {formData.primary_contact_address}
        </Typography>
        <Box mt={2}>
          <Typography variant="subtitle1">
            Rehearsal: {(formData.rehearsal.guests_attending || []).join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            Ceremony: {(formData.ceremony.guests_attending || []).join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            Reception: {(formData.reception.guests_attending || []).join(', ')}
          </Typography>
          <Typography variant="subtitle1">
            Roce: {(formData.roce.guests_attending || []).join(', ')}
          </Typography>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button variant="contained" onClick={onNext}>
            Submit RSVP
          </Button>
        </Box>
      </Box>
    </StepLayout>
);

export default ConfirmationStep;
