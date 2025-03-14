import React from 'react';
import { Rsvp } from "../../../types/rsvp";
import RsvpEventPage from "./RsvpEventPage";

interface RsvpRocePageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpRocePage: React.FC<RsvpRocePageProps> = ({
                                                     nextPage,
                                                     previousPage,
                                                     requireAnswers,
                                                     returnPage,
                                                   }) => {
  return (
      <RsvpEventPage
          eventKey="roce"
          nextPage={nextPage}
          previousPage={previousPage}
          requireAnswers={requireAnswers}
          returnPage={returnPage}
      />
  );
};

export default RsvpRocePage;
