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
          description="Celebrate our love during the wedding ceremony."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
      />
  );
};

export default RsvpCeremonyPage;
