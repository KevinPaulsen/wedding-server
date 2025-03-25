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
          title="Roce"
          time="Thursday, September 11th, 2025, at 6:30 p.m."
          description="Join us for a traditional Roce ceremony in Seattle (location TBD). We will email more details as they become available. Please select all guests who will be attending."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpRocePage;
