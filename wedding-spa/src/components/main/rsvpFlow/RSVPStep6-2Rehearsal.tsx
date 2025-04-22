// components/main/rsvpFlow/RSVPStep6-2Rehearsal.tsx
import React from 'react';
import RsvpEvents from './RsvpEvents';

interface RsvpRehearsalPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  isLastEvent?: boolean;
  loading: boolean;
}

const RsvpRehearsalPage: React.FC<RsvpRehearsalPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               isLastEvent,
                                                               loading,
                                                             }) => {
  return (
      <RsvpEvents
          eventKey="rehearsal"
          title="Rehearsal Dinner"
          time="Friday, September 12th, 2025, (Time TBD)"
          description="Join us for the Rehearsal Dinner in Seattle (location and time TBD). Please select all guests who will be attending."
          nextPage={nextPage}
          previousPage={previousPage}
          isLastEvent={isLastEvent}
          loading={loading}
      />
  );
};

export default RsvpRehearsalPage;
