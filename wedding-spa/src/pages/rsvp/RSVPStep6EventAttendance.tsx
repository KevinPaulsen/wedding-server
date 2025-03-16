// pages/rsvp/RSVPStep6EventAttendance.tsx
import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useFormContext, useWatch, SubmitHandler } from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import { Rsvp } from '../../types/rsvp';
import { FormData } from './RsvpFlowPage';

interface EventAttendanceStepProps {
  rsvp: Rsvp;
  onNext: () => void;
  onBack: () => void;
}

const EventAttendanceStep: React.FC<EventAttendanceStepProps> = ({ rsvp, onNext, onBack }) => {
  const { register, handleSubmit } = useFormContext<FormData>();

  const guestOptions = Object.entries(rsvp.guest_list).map(([id, detail]) => ({
    id,
    name: detail.display_name,
  }));

  // Helper function to render checkboxes for an event.
  const renderEventAttendance = (eventName: string) => {
    const attendanceValues = useWatch({ name: `${eventName}_attendance` });
    return (
        <Box mb={2}>
          <Typography variant="h6">
            {eventName.charAt(0).toUpperCase() + eventName.slice(1)} Attendance
          </Typography>
          {guestOptions.map((guest) => (
              <FormControlLabel
                  key={guest.id}
                  control={
                    <Checkbox
                        {...register(`${eventName}_attendance` as any)}
                        value={guest.id}
                        defaultChecked={attendanceValues?.includes(guest.id) || false}
                    />
                  }
                  label={guest.name}
              />
          ))}
        </Box>
    );
  };

  const onSubmit: SubmitHandler<FormData> = () => onNext();

  return (
      <StepLayout
          title="Event Attendance"
          description="Select which events you'll be attending."
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} textAlign="center">
          {renderEventAttendance('rehearsal')}
          {renderEventAttendance('ceremony')}
          {renderEventAttendance('reception')}
          {renderEventAttendance('roce')}
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

export default EventAttendanceStep;
