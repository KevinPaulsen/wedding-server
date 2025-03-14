import React from 'react';
import { Rsvp } from "../../../types/rsvp";
import RsvpEventPage from "./RsvpEventPage";

interface RsvpCeremonyPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpCeremonyPage: React.FC<RsvpCeremonyPageProps> = ({
                                                             nextPage,
                                                             previousPage,
                                                             requireAnswers,
                                                             returnPage,
                                                           }) => {
  return (
      <RsvpEventPage
          eventKey="ceremony"
          nextPage={nextPage}
          previousPage={previousPage}
          requireAnswers={requireAnswers}
          returnPage={returnPage}
      />
  );
};

export default RsvpCeremonyPage;
