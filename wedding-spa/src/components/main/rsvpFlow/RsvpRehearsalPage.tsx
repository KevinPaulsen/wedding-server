// components/main/rsvpFlow/RsvpRehearsalPage.tsx
import React from 'react';
import { Rsvp } from "../../../types/rsvp";
import RsvpEventPage from "./RsvpEventPage";

interface RsvpRehearsalPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpRehearsalPage: React.FC<RsvpRehearsalPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               requireAnswers,
                                                               returnPage,
                                                             }) => {
  return (
      <RsvpEventPage
          eventKey="rehearsal"
          nextPage={nextPage}
          previousPage={previousPage}
          requireAnswers={requireAnswers}
          returnPage={returnPage}
      />
  );
};

export default RsvpRehearsalPage;
