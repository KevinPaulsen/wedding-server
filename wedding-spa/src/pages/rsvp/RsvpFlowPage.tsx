// pages/rsvp/RsvpFlowPage.tsx
import React, {useState} from 'react';
import {Box, Button, CircularProgress, Fade, Typography} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import NameLookupStep from './RSVPStep1NameLookup';
import RsvpSelectionStep from './RSVPStep2RsvpSelection';
import AttendanceDecisionStep from './RSVPStep3AttendanceDecision';
import PrimaryContactStep from './RSVPStep4PrimaryContact';
import RsvpGuestDetailsStep from './RSVPStep5GuestDetails';
import ThankYouStep from './RSVPStep7ThankYou';

import {Rsvp, RsvpGuestDetailWithId} from '../../types/rsvp';
import {useSubmitRsvp} from '../../hooks/rsvp/useSubmitRsvp';
import RsvpRocePage from "./RSVPStep6-1Roce";
import RsvpRehearsalPage from "./RSVPStep6-2Rehearsal";
import RsvpCeremonyPage from "./RSVPStep6-3Ceremony";
import RsvpReceptionPage from "./RSVPStep6-4Reception";

const NAME_LOOKUP_STEP = 1;
const SELECTION_STEP = NAME_LOOKUP_STEP + 1;
const ATTENDANCE_DECISION_STEP = SELECTION_STEP + 1;
const PRIMARY_CONTACT_STEP = ATTENDANCE_DECISION_STEP + 1;
const GUEST_DETAILS_STEP = PRIMARY_CONTACT_STEP + 1;
const ROCE_EVENT_STEP = GUEST_DETAILS_STEP + 1;
const REHEARSAL_EVENT_STEP = ROCE_EVENT_STEP + 1;
const CEREMONY_EVENT_STEP = REHEARSAL_EVENT_STEP + 1;
const RECEPTION_EVENT_STEP = CEREMONY_EVENT_STEP + 1;
const THANK_YOU_STEP = RECEPTION_EVENT_STEP + 1;

export type EventData = {
  invited: boolean;
  guests_attending: string[];
};

export type FormData = {
  first_name: string;
  last_name: string;
  selectedRsvpId?: string;
  anyGuestAttending: 'yes' | 'no';
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  primary_contact_address: string;
  rehearsal: EventData;
  ceremony: EventData;
  reception: EventData;
  roce: EventData;
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
      rehearsal: { invited: false, guests_attending: [] },
      ceremony: { invited: false, guests_attending: [] },
      reception: { invited: false, guests_attending: [] },
      roce: { invited: false, guests_attending: [] },
      guest_details: [],
    },
  });

  // Watch form data for dynamic checks (like event invitation status)
  const formData = methods.watch();

  // Mapping of event steps to their corresponding keys in FormData
  const eventStepKeys: { [step: number]: keyof FormData } = {
    6: 'roce',
    7: 'rehearsal',
    8: 'ceremony',
    9: 'reception',
  };

  const isStepInvited = (step: number): boolean => {
    const key = eventStepKeys[step];
    if (!key) return true;
    return (formData[key] as EventData).invited;
  };

  const [skippedSelection, setSkippedSelection] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showStep, setShowStep] = useState<boolean>(true);
  const [lookupResults, setLookupResults] = useState<Rsvp[] | null>(null);
  const [selectedRsvp, setSelectedRsvp] = useState<Rsvp | null>(null);
  const submitRsvpApi = useSubmitRsvp();
  const [submitting, setSubmitting] = useState(false);

  // Cancel resets form and navigates home.
  const handleCancel = () => {
    methods.reset();
    navigate('/');
  };

  // Transition between steps with a fade.
  const transitionToStep = (newStep: number) => {
    setShowStep(false);
    setTimeout(() => {
      setCurrentStep(newStep);
      setShowStep(true);
    }, 300);
  };

  // Helper functions to skip event steps that the user is not invited to.
  const getNextStep = (step: number): number => {
    let next = step + 1;
    while ([6, 7, 8, 9].includes(next) && !isStepInvited(next)) {
      next++;
    }
    return next;
  };

  const getPreviousStep = (step: number): number => {
    let prev = step - 1;
    while ([6, 7, 8, 9].includes(prev) && !isStepInvited(prev)) {
      prev--;
    }
    return prev;
  };

  const nextStep = () => transitionToStep(getNextStep(currentStep));
  const previousStep = () => transitionToStep(getPreviousStep(currentStep));

  // Convert guest_list object into an array.
  const convertToGuestList = (guestList: { [key: string]: any }): RsvpGuestDetailWithId[] =>
      Object.entries(guestList).map(([id, details]) => ({ id, ...details }));

  // Handle lookup: if one result, prepopulate form and skip selection.
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
      // Set each event field.
      methods.setValue('rehearsal', {
        invited: singleRsvp.rehearsal.invited,
        guests_attending: singleRsvp.rehearsal.guests_attending,
      });
      methods.setValue('ceremony', {
        invited: singleRsvp.ceremony.invited,
        guests_attending: singleRsvp.ceremony.guests_attending,
      });
      methods.setValue('reception', {
        invited: singleRsvp.reception.invited,
        guests_attending: singleRsvp.reception.guests_attending,
      });
      methods.setValue('roce', {
        invited: singleRsvp.roce.invited,
        guests_attending: singleRsvp.roce.guests_attending,
      });
      // Set guest details.
      methods.setValue('guest_details', convertToGuestList(singleRsvp.guest_list));
      setSkippedSelection(true);
      transitionToStep(3); // Proceed to Attendance Decision
    } else if (results.length > 1) {
      setSkippedSelection(false);
      transitionToStep(2); // Proceed to RSVP Selection
    }
  };

  const handleRsvpSelectionNext = (rsvp: Rsvp) => {
    setSelectedRsvp(rsvp);
    methods.setValue('selectedRsvpId', rsvp.rsvp_id);
    methods.setValue('primary_contact_name', rsvp.primary_contact.name);
    methods.setValue('primary_contact_email', rsvp.primary_contact.email);
    methods.setValue('primary_contact_phone', rsvp.primary_contact.phone_number);
    methods.setValue('primary_contact_address', rsvp.primary_contact.address);
    methods.setValue('rehearsal', {
      invited: rsvp.rehearsal.invited,
      guests_attending: rsvp.rehearsal.guests_attending,
    });
    methods.setValue('ceremony', {
      invited: rsvp.ceremony.invited,
      guests_attending: rsvp.ceremony.guests_attending,
    });
    methods.setValue('reception', {
      invited: rsvp.reception.invited,
      guests_attending: rsvp.reception.guests_attending,
    });
    methods.setValue('roce', {
      invited: rsvp.roce.invited,
      guests_attending: rsvp.roce.guests_attending,
    });
    methods.setValue('guest_details', convertToGuestList(rsvp.guest_list));
    nextStep(); // Proceed to Attendance Decision
  };

  // When user selects "no" for attendance.
  const handleSubmitNo = async () => {
    const formData = methods.getValues();
    const updatedGuestList = (formData.guest_details || []).map((guest) => ({
      ...guest,
      coming: false,
    }));
    const rsvpToSubmit: Rsvp = {
      ...selectedRsvp!,
      guest_list: updatedGuestList.reduce((acc, guest) => {
        acc[guest.id] = guest;
        return acc;
      }, {} as { [key: string]: any }),
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
      transitionToStep(11); // Thank You step
    } else {
      alert(response.error || 'Submission failed');
    }
  };

  // Final submission: convert guest_details array back to object and include event data.
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
      roce: formData.roce,
      rehearsal: formData.rehearsal,
      ceremony: formData.ceremony,
      reception: formData.reception,
    };
    const response = await submitRsvpApi.execute(rsvpToSubmit);
    setSubmitting(false);
    if (response.success) {
      nextStep(); // Proceed to Thank You (step 10)
    } else {
      alert(response.error || 'Submission failed');
    }
  };

  // Custom onBack for Attendance Decision.
  const onBackFromAttendance = () => {
    if (skippedSelection) {
      transitionToStep(1);
    } else {
      transitionToStep(2);
    }
  };

  const invitedSteps = [6, 7, 8, 9].filter((step) => isStepInvited(step));
  const lastInvitedStep = invitedSteps.length ? Math.max(...invitedSteps) : null;

  // Render steps.
  const renderStep = () => {
    switch (currentStep) {
      case NAME_LOOKUP_STEP:
        return <NameLookupStep onNext={handleLookupNext} />;
      case SELECTION_STEP:
        return (
            lookupResults && (
                <RsvpSelectionStep
                    lookupResults={lookupResults}
                    onNext={handleRsvpSelectionNext}
                    onBack={previousStep}
                />
            )
        );
      case ATTENDANCE_DECISION_STEP:
        return (
            <AttendanceDecisionStep
                onNext={nextStep}
                onSubmitNo={handleSubmitNo}
                onBack={onBackFromAttendance}
            />
        );
      case PRIMARY_CONTACT_STEP:
        return (
            selectedRsvp && (
                <PrimaryContactStep
                    rsvp={selectedRsvp}
                    onNext={nextStep}
                    onBack={previousStep}
                />
            )
        );
      case GUEST_DETAILS_STEP:
        return (
            selectedRsvp && (
                <RsvpGuestDetailsStep
                    rsvp={selectedRsvp}
                    onNext={nextStep}
                    onBack={previousStep}
                />
            )
        );
      case ROCE_EVENT_STEP:
        return selectedRsvp ? (
            <RsvpRocePage
                nextPage={(formData: FormData) =>
                    currentStep === lastInvitedStep ? handleSubmitRsvp(formData) : nextStep()
                }
                previousPage={() => previousStep()}
                isLastEvent={currentStep === lastInvitedStep}
            />
        ) : null;
      case REHEARSAL_EVENT_STEP:
        return selectedRsvp ? (
            <RsvpRehearsalPage
                nextPage={(formData: FormData) =>
                    currentStep === lastInvitedStep ? handleSubmitRsvp(formData) : nextStep()
                }
                previousPage={() => previousStep()}
                isLastEvent={currentStep === lastInvitedStep}
            />
        ) : null;
      case CEREMONY_EVENT_STEP:
        return selectedRsvp ? (
            <RsvpCeremonyPage
                nextPage={(formData: FormData) =>
                    currentStep === lastInvitedStep ? handleSubmitRsvp(formData) : nextStep()
                }
                previousPage={() => previousStep()}
                isLastEvent={currentStep === lastInvitedStep}
            />
        ) : null;
      case RECEPTION_EVENT_STEP:
        return selectedRsvp ? (
            <RsvpReceptionPage
                nextPage={(formData: FormData) =>
                    currentStep === lastInvitedStep ? handleSubmitRsvp(formData) : nextStep()
                }
                previousPage={() => previousStep()}
                isLastEvent={currentStep === lastInvitedStep}
            />
        ) : null;
      case THANK_YOU_STEP:
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
          {/* Header */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Kevin & Olivia
            </Typography>
          </Box>

          {/* Step Content */}
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

          {/* Cancel Button */}
          <Box sx={{ mb: 2 }}>
            <Button onClick={handleCancel}>Cancel</Button>
          </Box>

          {/* Submission Progress */}
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
