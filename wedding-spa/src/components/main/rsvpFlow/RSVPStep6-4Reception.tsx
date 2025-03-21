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
          description="Celebrate with us at the reception at Pickering Barn (1730 10th Ave NW, Issaquah, WA 98027) at 5:30 p.m. on September 13th, 2025. Please select all guests who will be attending."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpReceptionPage;
