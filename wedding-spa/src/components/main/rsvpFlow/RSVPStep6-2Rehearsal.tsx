// components/main/rsvpFlow/RSVPStep6-2Rehearsal.tsx
import React from 'react';
import RsvpEvents from './RsvpEvents';

interface RsvpRehearsalPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  isLastEvent?: boolean;
}

const RsvpRehearsalPage: React.FC<RsvpRehearsalPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               isLastEvent,
                                                             }) => {
  return (
      <RsvpEvents
          eventKey="rehearsal"
          title="Rehearsal Dinner"
          description="Enjoy an intimate rehearsal dinner with us."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpRehearsalPage;
