// components/main/rsvpFlow/RSVPStep6-1Roce.tsx
import React from 'react';
import RsvpEvents from './RsvpEvents';

interface RsvpRocePageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  isLastEvent?: boolean;
}

const RsvpRocePage: React.FC<RsvpRocePageProps> = ({
                                                     nextPage,
                                                     previousPage,
                                                     isLastEvent,
                                                   }) => {
  return (
      <RsvpEvents
          eventKey="roce"
          title="Roce Event"
          description="Join us for a memorable Roce experience."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpRocePage;
