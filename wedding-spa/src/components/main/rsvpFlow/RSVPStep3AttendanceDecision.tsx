// components/main/rsvpFlow/RSVPStep3AttendanceDecision.tsx
import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import {SubmitHandler, useFormContext} from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import {FormData} from '../../../pages/rsvp/RsvpFlowPage';
import CustomButton from "../../shared/CustomButton";

interface AttendanceDecisionStepProps {
  onNext: () => void;
  onSubmitNo: () => void;
  onBack: () => void;
  submitted: boolean;
}

const AttendanceDecisionStep: React.FC<AttendanceDecisionStepProps> = ({
                                                                         onNext,
                                                                         onSubmitNo,
                                                                         onBack,
                                                                         submitted,
                                                                       }) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();

  const guestDetails = watch('guest_details') || [];

  // Local state: null means no selection, true for yes, false for no.
  const [selection, setSelection] = useState<boolean | null>(null);

  // If this RSVP has already been submitted, default based on who’s coming
  useEffect(() => {
    if (submitted) {
      const anyComing = guestDetails.some(g => g.coming);
      setSelection(anyComing);
    }
  }, [submitted, guestDetails]);

  // Update the form field only if a selection has been made.
  useEffect(() => {
    setValue('anyGuestAttending', selection === null ? '' : (selection ? 'yes' : 'no'));
  }, [setValue, selection]);

  const handleOptionSelect = (value: boolean) => {
    setSelection(value);
    setValue('anyGuestAttending', value ? 'yes' : 'no');
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (data.anyGuestAttending === 'yes') {
      onNext();
    } else if (data.anyGuestAttending === 'no') {
      onSubmitNo();
    }
  };

  return (
      <StepLayout
          title="Will you be able to attend?"
          description="If you or anyone in your party can attend the wedding, select “Yes” and proceed with the RSVP."
          onBack={onBack}
          onSubmit={handleSubmit(onSubmit)}
          nextText={selection === false ? 'Submit' : 'Next'}
          nextDisabled={selection === null}  // Disable button until an option is selected.
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <CustomButton
              text="Yes"
              onClick={() => handleOptionSelect(true)}
              variant={selection === true ? 'dark' : 'light'}
              width="100px"
          />
          <CustomButton
              text="No"
              onClick={() => handleOptionSelect(false)}
              variant={selection === false ? 'dark' : 'light'}
              width="100px"
          />
        </Box>
        {errors.anyGuestAttending && (
            <Typography color="error">This field is required</Typography>
        )}
      </StepLayout>
  );
};

export default AttendanceDecisionStep;
