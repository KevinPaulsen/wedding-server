// components/shared/rsvpFlow/RsvpFormStep.tsx
import React from 'react';
import {Box, Typography} from '@mui/material';
import RsvpConfirmation from './RsvpConfirmation';
import RsvpVerificationPage from './RsvpVerificationPage';
import RsvpPrimaryContactPage from './RsvpPrimaryContactPage';
import RsvpGuestDetailsPage from './RsvpGuestDetailsPage';
import RsvpRocePage from './RsvpRocePage';
import RsvpRehearsalPage from './RsvpRehearsalPage';
import RsvpCeremonyPage from './RsvpCeremonyPage';
import RsvpReceptionPage from './RsvpReceptionPage';
import RsvpGuestAttendancePage from "./RsvpGuestAttendancePage";
import {Rsvp} from "../../../types/rsvp";

interface RsvpFormStepProps {
  step: number;
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers?: boolean;
  returnPage?: string | null;
}

interface RsvpLayoutProps {
  title: string;
  component: React.ReactNode;
}

export const RSVP_VERIFICATION_PAGE = 1;
export const RSVP_GUEST_ATTENDANCE_PAGE = 2;
export const RSVP_PRIMARY_CONTACT_PAGE = 3;
export const RSVP_GUEST_DETAILS_PAGE = 4;
export const RSVP_ROCE_PAGE = 5;
export const RSVP_REHEARSAL_PAGE = 6;
export const RSVP_CEREMONY_PAGE = 7;
export const RSVP_RECEPTION_PAGE = 8;
export const RSVP_CONFIRMATION_PAGE = 9;

const RsvpFormLayout: React.FC<RsvpLayoutProps> = ({title, component}) => {
  return (
      <Box>
        <Typography variant="h5" sx={{mb: 2}}>{title}</Typography>
        {component}
      </Box>
  );
};

const RSVPFormStep: React.FC<RsvpFormStepProps> = ({
                                                     step,
                                                     nextPage,
                                                     previousPage,
                                                     requireAnswers = true,
                                                     returnPage = null,
                                                   }) => {
  switch (step) {
    case RSVP_VERIFICATION_PAGE:
      return (
          <RsvpFormLayout
              title="RSVP Verification"
              component={
                <RsvpVerificationPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_GUEST_ATTENDANCE_PAGE:
      return (
          <RsvpFormLayout
              title="Guest Attendance"
              component={
                <RsvpGuestAttendancePage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_PRIMARY_CONTACT_PAGE:
      return (
          <RsvpFormLayout
              title="Contact Information"
              component={
                <RsvpPrimaryContactPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_GUEST_DETAILS_PAGE:
      return (
          <RsvpFormLayout
              title="Guest Details"
              component={
                <RsvpGuestDetailsPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
              }
          />
      );
    case RSVP_ROCE_PAGE:
      return (
          <RsvpFormLayout
              title="Roce Attendance"
              component={
                <RsvpRocePage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_REHEARSAL_PAGE:
      return (
          <RsvpFormLayout
              title="Rehearsal Attendance"
              component={
                <RsvpRehearsalPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_CEREMONY_PAGE:
      return (
          <RsvpFormLayout
              title="Ceremony Attendance"
              component={
                <RsvpCeremonyPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_RECEPTION_PAGE:
      return (
          <RsvpFormLayout
              title="Reception Attendance"
              component={
                <RsvpReceptionPage
                    nextPage={nextPage}
                    previousPage={previousPage}
                    requireAnswers={requireAnswers}
                    returnPage={returnPage}
                />
              }
          />
      );
    case RSVP_CONFIRMATION_PAGE:
      return (
          <RsvpFormLayout
              title="Confirmation"
              component={<RsvpConfirmation returnPage={returnPage}/>}
          />
      );
    default:
      return <Box>Unknown Step</Box>;
  }
};

export default RSVPFormStep;
