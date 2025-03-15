// components/main/rsvpFlow/RsvpGuestAttendancePage.tsx
import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import CustomButton from '../../shared/CustomButton';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp } from '../../../types/rsvp';
import { useSubmitRsvp } from '../../../hooks/rsvp/useSubmitRsvp';
import {RSVP_CONFIRMATION_PAGE, RSVP_VERIFICATION_PAGE} from "./RsvpFormStep";

interface RsvpGuestAttendancePageProps {
  nextPage: (rsvp: Rsvp, resetOrTargetStep?: (() => void) | number) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers?: boolean;
  returnPage?: string | null;
}

const RsvpGuestAttendancePage: React.FC<RsvpGuestAttendancePageProps> = ({
                                                                           nextPage,
                                                                           previousPage,
                                                                         }) => {
  const { formData, lookupResults, setFormData, resetFormData } = useFlow();
  const { execute: doSubmit, error, loading } = useSubmitRsvp();

  // Compute initial selection: true if at least one guest is coming, false otherwise.
  const initialSelection = Object.values(formData.guest_list || {}).some(
      guest => guest.coming
  );
  const [selection, setSelection] = useState<boolean>(initialSelection);

  const handleOptionSelect = (option: boolean) => {
    setSelection(option);
  };

  const handleBack = () => {
    if (lookupResults && lookupResults.length !== 0) {
      previousPage(formData);
    } else {
      nextPage(formData, RSVP_VERIFICATION_PAGE);
    }
  };

  const handleNext = async () => {
    if (selection) {
      // "Yes" selected: proceed to the next page in the flow.
      nextPage(formData);
    } else {
      // "No" selected: update all guests as not coming, mark RSVP as submitted, and submit.
      const updatedGuestList = Object.keys(formData.guest_list || {}).reduce(
          (acc, key) => {
            acc[key] = { ...formData.guest_list[key], coming: false };
            return acc;
          },
          {} as { [key: string]: any }
      );
      const updatedFormData: Rsvp = {
        ...formData,
        guest_list: updatedGuestList,
        submitted: true,
      };
      setFormData(updatedFormData);
      await doSubmit(updatedFormData);
      if (!error) {
        resetFormData();
        // Directly go to confirmation page when "No" is selected.
        nextPage(updatedFormData, RSVP_CONFIRMATION_PAGE);
      }
    }
  };

  return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Will any guest from your RSVP be attending?
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <CustomButton
              text="Yes"
              onClick={() => handleOptionSelect(true)}
              variant={selection ? 'dark' : 'lightOutlined'}
              width="100px"
          />
          <CustomButton
              text="No"
              onClick={() => handleOptionSelect(false)}
              variant={!selection ? 'dark' : 'lightOutlined'}
              width="100px"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <CustomButton
              text="Back"
              onClick={handleBack}
              variant="dark"
              width="75px"
              disabled={loading}
          />
          <CustomButton
              text={!selection ? (loading ? 'Submitting...' : 'Submit') : 'Next'}
              onClick={handleNext}
              variant="dark"
              width="auto"
              disabled={loading}
          />
        </Box>
      </Box>
  );
};

export default RsvpGuestAttendancePage;
