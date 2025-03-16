// pages/rsvp/RSVPStep4PrimaryContact.tsx
import React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import {SubmitHandler, useFormContext} from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import {Rsvp} from '../../types/rsvp';
import {FormData} from './RsvpFlowPage';

interface PrimaryContactStepProps {
  rsvp: Rsvp;
  onNext: () => void;
  onBack: () => void;
}

const PrimaryContactStep: React.FC<PrimaryContactStepProps> = ({ rsvp, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormContext<FormData>();

  const onSubmit: SubmitHandler<FormData> = () => onNext();

  // Prepare guest list options.
  const guestOptions = Object.entries(rsvp.guest_list).map(([id, detail]) => ({
    id,
    name: detail.display_name,
  }));

  // Compute default display value.
  const defaultPrimaryContactDisplayName =
      rsvp.guest_list[rsvp.primary_contact.name]?.display_name ||
      rsvp.primary_contact.name;

  return (
      <StepLayout
          title="Primary Contact Information"
          description="Confirm or update your contact details."
          onBack={onBack}
          onSubmit={handleSubmit(onSubmit)}
      >
        <Box maxWidth="400px">
          <FormControl
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.primary_contact_name}
          >
            <InputLabel id="primary-contact-label">Primary Contact</InputLabel>
            <Select
                labelId="primary-contact-label"
                label="Primary Contact"
                defaultValue={defaultPrimaryContactDisplayName}
                {...register('primary_contact_name', {
                  required: 'Please select a primary contact',
                })}
            >
              {guestOptions.map((guest) => (
                  <MenuItem key={guest.id} value={guest.name}>
                    {guest.name}
                  </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ marginTop: 0, marginBottom: 0, minHeight: 0 }}>
              {errors.primary_contact_name?.message || ''}
            </FormHelperText>
          </FormControl>
          <TextField
              label="Email"
              fullWidth
              margin="normal"
              size="small"
              required
              {...register('primary_contact_email', {
                required: 'Email is required',
              })}
              error={!!errors.primary_contact_email}
              helperText={errors.primary_contact_email?.message || ''}
          />
          <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              size="small"
              required
              {...register('primary_contact_phone', {
                required: 'Phone number is required',
              })}
              error={!!errors.primary_contact_phone}
              helperText={errors.primary_contact_phone?.message || ''}
          />
          <TextField
              label="Address"
              fullWidth
              margin="normal"
              size="small"
              required
              {...register('primary_contact_address', {
                required: 'Address is required',
              })}
              error={!!errors.primary_contact_address}
              helperText={errors.primary_contact_address?.message || ''}
          />
        </Box>
      </StepLayout>
  );
};

export default PrimaryContactStep;
