// components/main/rsvpFlow/RsvpVerificationPage.tsx
import React, { useEffect, useRef } from 'react';
import { Alert, Box } from '@mui/material';
import CustomInputField, { CustomInputFieldRef } from '../../shared/CustomInputField';
import { useFlow } from '../../../context/FlowProvider';
import { useLookupRsvp } from '../../../hooks/rsvp/useLookupRsvp';
import { Rsvp } from "../../../types/rsvp";
import CustomButton from "../../shared/CustomButton";
import { useFormFields } from '../../../hooks/useFormFields';
import {RSVP_GUEST_ATTENDANCE_PAGE} from "./RsvpFormStep";

interface RsvpVerificationPageProps {
  nextPage: (rsvp: Rsvp, targetStep?: number) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpVerificationPage: React.FC<RsvpVerificationPageProps> = ({ nextPage, requireAnswers }) => {
  const { formData, setFormData, resetLookupResults, setLookupResults } = useFlow();
  const firstNameRef = useRef<CustomInputFieldRef>(null);
  const lastNameRef = useRef<CustomInputFieldRef>(null);

  const { data, error, loading, execute: doLookup } = useLookupRsvp();

  const [form, handleChange] = useFormFields<{ firstName: string; lastName: string }>({
    firstName: '',
    lastName: '',
  });

  const handleNext = async () => {
    const validFirst = firstNameRef.current?.validate();
    const validLast = lastNameRef.current?.validate();
    if (!validFirst || !validLast) return;
    await doLookup({ first_name: form.firstName, last_name: form.lastName });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleNext();
  };

  useEffect(() => {
    if (data && data.length > 0) {
      if (data.length === 1) {
        // Only one RSVP found, update formData and proceed immediately.
        setFormData(data[0]);
        resetLookupResults();
        nextPage(data[0], RSVP_GUEST_ATTENDANCE_PAGE);
      } else {
        // Multiple RSVPs found: store lookup results and navigate to the selection page.
        setLookupResults(data);
        nextPage(formData); // formData remains unchanged; selection page will update it.
      }
    }
  }, [data, setFormData, nextPage, setLookupResults, formData]);

  return (
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <CustomInputField
              ref={firstNameRef}
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Enter your First Name"
              value={form.firstName}
              onChange={handleChange}
              required={requireAnswers}
          />
          <CustomInputField
              ref={lastNameRef}
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter your Last Name"
              value={form.lastName}
              onChange={handleChange}
              required={requireAnswers}
          />
          <CustomButton
              type="submit"
              text={loading ? 'Validating...' : 'Next'}
              variant="dark"
              width="auto"
              disabled={loading}
          />
        </Box>
      </Box>
  );
};

export default RsvpVerificationPage;
