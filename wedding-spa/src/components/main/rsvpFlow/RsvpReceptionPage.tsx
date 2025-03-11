// components/shared/rsvpFlow/RsvpReceptionPage.tsx
import React from 'react';
import {useSubmitRsvp} from '../../../hooks/rsvp/useSubmitRsvp';
import GuestSelection from "./GuestSelection";
import {Rsvp} from "../../../types/rsvp";

interface RsvpReceptionPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpReceptionPage: React.FC<RsvpReceptionPageProps> = ({nextPage, previousPage}) => {
  const {execute: doSubmit, error, loading} = useSubmitRsvp();

  const handleSubmit = async (formData: Rsvp, resetFormData?: () => void) => {
    if (!resetFormData) return;
    await doSubmit(formData);

    // If no error after finishing, reset and navigate
    if (!error) {
      resetFormData();
      nextPage(formData);
    }
  };

  return (
      <GuestSelection
          eventKey="reception"
          backPage={previousPage}
          nextPage={handleSubmit}
          loading={loading}
      />
  );
};

export default RsvpReceptionPage;
