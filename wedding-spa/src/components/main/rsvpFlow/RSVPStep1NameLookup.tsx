// components/main/rsvpFlow/RSVPStep1NameLookup.tsx
import React, { useState } from 'react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import { Rsvp } from '../../../types/rsvp';
import { useLookupRsvp } from '../../../hooks/rsvp/useLookupRsvp';
import { LookupDTO } from '../../../types/RsvpDTO';
import { FormData } from '../../../pages/rsvp/RsvpFlowPage';

interface NameLookupStepProps {
  onNext: (results: Rsvp[]) => void;
}

const NameLookupStep: React.FC<NameLookupStepProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors }, trigger } = useFormContext<FormData>();
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const lookupRsvpApi = useLookupRsvp();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setLookupError(null);
    const dto: LookupDTO = {
      first_name: data.first_name,
      last_name: data.last_name,
      rsvp_code: data.rsvp_code
    };
    const response = await lookupRsvpApi.execute(dto);
    if (response.success && response.data) {
      onNext(response.data);
    } else {
      setLookupError(response.error || 'Lookup failed. Please check your details.');
    }
    setLoading(false);
  };

  return (
      <StepLayout
          title="Enter Your Name"
          description="Enter your first and last name. If you have any trouble, please contact Kevin or Olivia."
          onSubmit={handleSubmit(onSubmit)}
          nextText={loading ? <CircularProgress size={24} color={"secondary"} /> : 'Lookup RSVP'}
          nextDisabled={loading}
      >
        <Box maxWidth='300px'>
          <TextField
              label="First Name"
              size='small'
              fullWidth
              margin="normal"
              {...register('first_name', {
                required: 'First name is required',
                onBlur: () => trigger('first_name'),
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
          />
          <TextField
              label="Last Name"
              size='small'
              fullWidth
              margin="normal"
              {...register('last_name', {
                required: 'Last name is required',
                onBlur: () => trigger('last_name'),
              })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
          />
          <TextField
              label="RSVP Code"
              size='small'
              fullWidth
              margin="normal"
              {...register('rsvp_code', {
                required: 'RSVP Code is required',
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
                onBlur: () => trigger('rsvp_code'),
              })}
              error={!!errors.rsvp_code}
              helperText={errors.rsvp_code?.message}
              inputProps={{ style: { textTransform: 'uppercase' } }}
          />
          {lookupError && (
              <Typography color="error" variant="body2">
                {lookupError}
              </Typography>
          )}
        </Box>
      </StepLayout>
  );
};

export default NameLookupStep;
