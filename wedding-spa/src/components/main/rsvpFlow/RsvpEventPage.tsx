// components/main/rsvpFlow/RsvpEventPage.tsx
import React from 'react';
import GuestSelection from "./GuestSelection";
import { Rsvp } from "../../../types/rsvp";
import { useSubmitRsvp } from '../../../hooks/rsvp/useSubmitRsvp';

interface RsvpEventPageProps {
  eventKey: 'roce' | 'rehearsal' | 'ceremony' | 'reception';
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
  withSubmission?: boolean;
}

const RsvpEventPage: React.FC<RsvpEventPageProps> = ({
                                                       eventKey,
                                                       nextPage,
                                                       previousPage,
                                                       requireAnswers,
                                                       returnPage,
                                                       withSubmission = false,
                                                     }) => {
  const { execute: doSubmit, error, loading } = useSubmitRsvp();

  const handleSubmit = async (formData: Rsvp, resetFormData?: () => void) => {
    if (withSubmission) {
      if (!resetFormData) return;
      await doSubmit(formData);
      if (!error) {
        resetFormData();
        nextPage(formData);
      }
    } else {
      nextPage(formData);
    }
  };

  return (
      <GuestSelection
          eventKey={eventKey}
          backPage={previousPage}
          nextPage={handleSubmit}
          loading={withSubmission ? loading : undefined}
      />
  );
};

export default RsvpEventPage;
