// components/main/rsvpFlow/RSVPStep6-3Ceremony.tsx
import React from 'react';
import RsvpEvents from './RsvpEvents';

interface RsvpCeremonyPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  isLastEvent?: boolean;
}

const RsvpCeremonyPage: React.FC<RsvpCeremonyPageProps> = ({
                                                             nextPage,
                                                             previousPage,
                                                             isLastEvent,
                                                           }) => {
  return (
      <RsvpEvents
          eventKey="ceremony"
          title="Wedding Ceremony"
          time="Saturday, September 13th, 2025, at 12:30 PM"
          description="Join us for the Wedding Mass at Blessed Sacrament Church (5050 8th Ave NE, Seattle, WA 98105). Please select all guests who will be attending."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpCeremonyPage;
