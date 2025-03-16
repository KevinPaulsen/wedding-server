import React, { useState } from 'react';
import { Box, Button, CircularProgress, Fade, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import NameLookupStep from './RSVPStep1NameLookup';
import RsvpSelectionStep from './RSVPStep2RsvpSelection';
import AttendanceDecisionStep from './RSVPStep3AttendanceDecision';
import PrimaryContactStep from './RSVPStep4PrimaryContact';
import RsvpGuestDetailsStep from './RSVPStep5GuestDetails';
import EventAttendanceStep from './RSVPStep6EventAttendance';
import ConfirmationStep from './RSVPStep7Confirmation';
import ThankYouStep from './RSVPStep8ThankYou';

import {Rsvp, RsvpGuestDetailWithId} from '../../types/rsvp';
import { useSubmitRsvp } from '../../hooks/rsvp/useSubmitRsvp';

export type FormData = {
  first_name: string;
  last_name: string;
  selectedRsvpId?: string;
  anyGuestAttending: 'yes' | 'no';
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  primary_contact_address: string;
  rehearsal_attendance?: string[];
  ceremony_attendance?: string[];
  reception_attendance?: string[];
  roce_attendance?: string[];
  guest_details?: RsvpGuestDetailWithId[];
};

const RsvpFlow: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      anyGuestAttending: 'yes',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      primary_contact_address: '',
      rehearsal_attendance: [],
      ceremony_attendance: [],
      reception_attendance: [],
      roce_attendance: [],
      guest_details: [],
    },
  });

  // Manage state for steps, fade transitions, and RSVP data.
  const [skippedSelection, setSkippedSelection] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showStep, setShowStep] = useState<boolean>(true);
  const [lookupResults, setLookupResults] = useState<Rsvp[] | null>(null);
  const [selectedRsvp, setSelectedRsvp] = useState<Rsvp | null>(null);
  const submitRsvpApi = useSubmitRsvp();
  const [submitting, setSubmitting] = useState(false);

  // Cancel button resets the form and navigates home.
  const handleCancel = () => {
    methods.reset();
    navigate('/');
  };

  // Transition function: fades out, then changes step, then fades in.
  const transitionToStep = (newStep: number) => {
    setShowStep(false);
    setTimeout(() => {
      setCurrentStep(newStep);
      setShowStep(true);
    }, 300);
  };

  // Navigation handlers using the transition.
  const nextStep = () => transitionToStep(currentStep + 1);
  const previousStep = () => transitionToStep(currentStep - 1);

  // Helper to convert guest list object to an array.
  const convertToGuestList = (guestList: { [key: string]: any }): RsvpGuestDetailWithId[] =>
      Object.entries(guestList).map(([id, details]) => ({ id, ...details }));

  // Handle name lookup: if one RSVP is found, skip the selection step.
  const handleLookupNext = (results: Rsvp[]) => {
    setLookupResults(results);
    if (results.length === 1) {
      const singleRsvp = results[0];
      setSelectedRsvp(singleRsvp);
      methods.setValue('selectedRsvpId', singleRsvp.rsvp_id);
      methods.setValue('primary_contact_name', singleRsvp.primary_contact.name);
      methods.setValue('primary_contact_email', singleRsvp.primary_contact.email);
      methods.setValue('primary_contact_phone', singleRsvp.primary_contact.phone_number);
      methods.setValue('primary_contact_address', singleRsvp.primary_contact.address);
      // Set default event attendance values.
      methods.setValue('rehearsal_attendance', singleRsvp.rehearsal.guests_attending);
      methods.setValue('ceremony_attendance', singleRsvp.ceremony.guests_attending);
      methods.setValue('reception_attendance', singleRsvp.reception.guests_attending);
      methods.setValue('roce_attendance', singleRsvp.roce.guests_attending);
      // Also set guest details.
      methods.setValue('guest_details', convertToGuestList(singleRsvp.guest_list));
      setSkippedSelection(true);
      transitionToStep(3); // Jump to Attendance Decision (step 3)
    } else if (results.length > 1) {
      setSkippedSelection(false);
      transitionToStep(2); // Proceed to RSVP selection (step 2)
    }
  };

  // Handle selection step when multiple RSVP records are found.
  const handleRsvpSelectionNext = (rsvp: Rsvp) => {
    setSelectedRsvp(rsvp);
    methods.setValue('selectedRsvpId', rsvp.rsvp_id);
    methods.setValue('primary_contact_name', rsvp.primary_contact.name);
    methods.setValue('primary_contact_email', rsvp.primary_contact.email);
    methods.setValue('primary_contact_phone', rsvp.primary_contact.phone_number);
    methods.setValue('primary_contact_address', rsvp.primary_contact.address);
    methods.setValue('rehearsal_attendance', rsvp.rehearsal.guests_attending);
    methods.setValue('ceremony_attendance', rsvp.ceremony.guests_attending);
    methods.setValue('reception_attendance', rsvp.reception.guests_attending);
    methods.setValue('roce_attendance', rsvp.roce.guests_attending);
    // Also set guest details.
    methods.setValue('guest_details', convertToGuestList(rsvp.guest_list));
    nextStep(); // Proceed to Attendance Decision (step 3)
  };

  // When the user selects "no" for attendance.
  const handleSubmitNo = async () => {
    const formData = methods.getValues();
    const updatedGuestList = (formData.guest_details || []).map((guest) => ({
      ...guest,
      coming: false,
    }));
    const rsvpToSubmit: Rsvp = {
      ...selectedRsvp!,
      guest_list: updatedGuestList.reduce(
          (acc, guest, idx) => ({ ...acc, [idx]: guest }),
          {}
      ),
      submitted: true,
      primary_contact: {
        name: formData.primary_contact_name,
        email: formData.primary_contact_email,
        phone_number: formData.primary_contact_phone,
        address: formData.primary_contact_address,
      },
      rehearsal: {
        invited: selectedRsvp!.rehearsal.invited,
        guests_attending: [],
      },
      ceremony: {
        invited: selectedRsvp!.ceremony.invited,
        guests_attending: [],
      },
      reception: {
        invited: selectedRsvp!.reception.invited,
        guests_attending: [],
      },
      roce: {
        invited: selectedRsvp!.roce.invited,
        guests_attending: [],
      },
    };

    const response = await submitRsvpApi.execute(rsvpToSubmit);
    if (response.success) {
      transitionToStep(8); // Move to Thank You (step 8)
    } else {
      alert(response.error || 'Submission failed');
    }
  };

  // Final submission when the user confirms the RSVP.
  const handleSubmitRsvp = async (formData: FormData) => {
    setSubmitting(true);
    const rsvpToSubmit: Rsvp = {
      ...selectedRsvp!,
      submitted: true,
      guest_list: formData.guest_details
          ? formData.guest_details.reduce((acc, guest) => {
            acc[guest.id] = guest;
            return acc;
          }, {} as { [key: string]: any })
          : {},
      primary_contact: {
        name: formData.primary_contact_name,
        email: formData.primary_contact_email,
        phone_number: formData.primary_contact_phone,
        address: formData.primary_contact_address,
      },
      roce: {
        invited: selectedRsvp!.roce.invited,
        guests_attending: formData.roce_attendance || [],
      },
      rehearsal: {
        invited: selectedRsvp!.rehearsal.invited,
        guests_attending: formData.rehearsal_attendance || [],
      },
      ceremony: {
        invited: selectedRsvp!.ceremony.invited,
        guests_attending: formData.ceremony_attendance || [],
      },
      reception: {
        invited: selectedRsvp!.reception.invited,
        guests_attending: formData.reception_attendance || [],
      },
    };
    const response = await submitRsvpApi.execute(rsvpToSubmit);
    setSubmitting(false);
    if (response.success) {
      nextStep(); // Proceed to Thank You (step 8)
    } else {
      alert(response.error || 'Submission failed');
    }
  };

  const handleConfirmationNext = () => {
    const formData = methods.getValues();
    handleSubmitRsvp(formData);
  };

  // Custom onBack handler for the Attendance Decision step.
  const onBackFromAttendance = () => {
    if (skippedSelection) {
      transitionToStep(1);
    } else {
      transitionToStep(2);
    }
  };

  // Render the current step based on the currentStep state.
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NameLookupStep onNext={handleLookupNext} />;
      case 2:
        return (
            lookupResults && (
                <RsvpSelectionStep
                    lookupResults={lookupResults}
                    onNext={handleRsvpSelectionNext}
                    onBack={previousStep}
                />
            )
        );
      case 3:
        return (
            <AttendanceDecisionStep
                onNext={nextStep}
                onSubmitNo={handleSubmitNo}
                onBack={onBackFromAttendance}
            />
        );
      case 4:
        return (
            selectedRsvp && (
                <PrimaryContactStep
                    rsvp={selectedRsvp}
                    onNext={nextStep}
                    onBack={previousStep}
                />
            )
        );
      case 5:
        return (
            selectedRsvp && (
                <RsvpGuestDetailsStep
                    rsvp={selectedRsvp}
                    onNext={nextStep}
                    onBack={previousStep}
                />
            )
        );
      case 6:
        return (
            selectedRsvp && (
                <EventAttendanceStep
                    rsvp={selectedRsvp}
                    onNext={nextStep}
                    onBack={previousStep}
                />
            )
        );
      case 7:
        return (
            <ConfirmationStep
                formData={methods.getValues()}
                onNext={handleConfirmationNext}
                onBack={previousStep}
            />
        );
      case 8:
        return <ThankYouStep />;
      default:
        return null;
    }
  };

  return (
      <FormProvider {...methods}>
        <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
            }}
        >
          {/* Header with the "Kevin & Olivia" title */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Kevin & Olivia
            </Typography>
          </Box>

          {/* Step content (centered vertically and horizontally) */}
          <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
          >
            <Fade in={showStep} timeout={300}>
              <Box>{renderStep()}</Box>
            </Fade>
          </Box>

          {/* Cancel button */}
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>

          {/* Submission progress indicator */}
          {submitting && (
              <Box mt={2} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
          )}
        </Box>
      </FormProvider>
  );
};

export default RsvpFlow;
