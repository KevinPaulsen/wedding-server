// components/shared/rsvpFlow/RsvpRocePage.tsx
import React from 'react';
import GuestSelection from "./GuestSelection";
import {Rsvp} from "../../../types/rsvp";

interface RsvpRocePageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpRocePage: React.FC<RsvpRocePageProps> = ({nextPage, previousPage}) => {
  return (
      <GuestSelection
          eventKey="roce"
          backPage={previousPage}
          nextPage={nextPage}
      />
  );
};

export default RsvpRocePage;
