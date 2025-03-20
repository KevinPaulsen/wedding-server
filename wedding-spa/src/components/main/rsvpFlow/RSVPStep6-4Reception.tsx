// components/main/rsvpFlow/RSVPStep6-4Reception.tsx
import React from 'react';
import RsvpEvents from './RsvpEvents';

interface RsvpReceptionPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  isLastEvent?: boolean;
}

const RsvpReceptionPage: React.FC<RsvpReceptionPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               isLastEvent,
                                                             }) => {
  return (
      <RsvpEvents
          eventKey="reception"
          title="Wedding Reception"
          description="Dance the night away at our wedding reception."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpReceptionPage;
