// pages/rsvp/RSVPStep3AttendanceDecision.tsx
import React from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import { FormData } from './RsvpFlowPage';

interface AttendanceDecisionStepProps {
  onNext: () => void;
  onSubmitNo: () => void;
  onBack: () => void;
}

const AttendanceDecisionStep: React.FC<AttendanceDecisionStepProps> = ({
                                                                         onNext,
                                                                         onSubmitNo,
                                                                         onBack,
                                                                       }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (data.anyGuestAttending === 'yes') {
      onNext();
    } else {
      onSubmitNo();
    }
  };

  return (
      <StepLayout
          title="Will Any Guest Attend?"
          description="Let us know if any guest will be attending the wedding."
          onBack={onBack}
          onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Attendance</FormLabel>
          <RadioGroup row defaultValue='yes'>
            <FormControlLabel
                value="yes"
                control={<Radio {...register('anyGuestAttending', { required: true })} />}
                label="Yes"
            />
            <FormControlLabel
                value="no"
                control={<Radio {...register('anyGuestAttending', { required: true })} />}
                label="No"
            />
          </RadioGroup>
          {errors.anyGuestAttending && (
              <Typography color="error">This field is required</Typography>
          )}
        </FormControl>
      </StepLayout>
  );
};

export default AttendanceDecisionStep;
