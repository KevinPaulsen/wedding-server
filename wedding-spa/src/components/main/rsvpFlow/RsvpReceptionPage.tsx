// components/main/rsvpFlow/RsvpReceptionPage.tsx
import React from 'react';
import { Rsvp } from "../../../types/rsvp";
import RsvpEventPage from "./RsvpEventPage";

interface RsvpReceptionPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpReceptionPage: React.FC<RsvpReceptionPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               requireAnswers,
                                                               returnPage,
                                                             }) => {
  return (
      <RsvpEventPage
          eventKey="reception"
          nextPage={nextPage}
          previousPage={previousPage}
          requireAnswers={requireAnswers}
          returnPage={returnPage}
          withSubmission={true}
      />
  );
};

export default RsvpReceptionPage;
