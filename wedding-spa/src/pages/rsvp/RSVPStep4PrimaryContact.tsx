// pages/rsvp/RSVPStep4PrimaryContact.tsx
import React, { useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import { Rsvp } from '../../types/rsvp';
import { FormData } from './RsvpFlowPage';

interface PrimaryContactStepProps {
  rsvp: Rsvp;
  onNext: () => void;
  onBack: () => void;
}

const PrimaryContactStep: React.FC<PrimaryContactStepProps> = ({ rsvp, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext<FormData>();

  const onSubmit: SubmitHandler<FormData> = () => onNext();

  // Prepare guest list options.
  const guestOptions = Object.entries(rsvp.guest_list).map(([id, detail]) => ({
    id,
    name: detail.display_name,
  }));

  // Compute default display value.
  const defaultPrimaryContactDisplayName =
      rsvp.guest_list[rsvp.primary_contact.name]?.display_name || rsvp.primary_contact.name;

  return (
      <StepLayout
          title="Primary Contact Information"
          description="Confirm or update your contact details."
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} textAlign="center">
          <FormControl fullWidth margin="normal">
            <FormLabel>Primary Contact</FormLabel>
            <Select
                defaultValue={defaultPrimaryContactDisplayName}
                {...register('primary_contact_name', { required: 'Please select a primary contact' })}
            >
              {guestOptions.map((guest) => (
                  <MenuItem key={guest.id} value={guest.name}>
                    {guest.name}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register('primary_contact_email', { required: 'Email is required' })}
              error={!!errors.primary_contact_email}
              helperText={errors.primary_contact_email?.message}
          />
          <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              {...register('primary_contact_phone', { required: 'Phone number is required' })}
              error={!!errors.primary_contact_phone}
              helperText={errors.primary_contact_phone?.message}
          />
          <TextField
              label="Address"
              fullWidth
              margin="normal"
              {...register('primary_contact_address', { required: 'Address is required' })}
              error={!!errors.primary_contact_address}
              helperText={errors.primary_contact_address?.message}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="contained">
              Next
            </Button>
          </Box>
        </Box>
      </StepLayout>
  );
};

export default PrimaryContactStep;
