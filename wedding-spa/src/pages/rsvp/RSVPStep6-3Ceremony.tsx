// pages/rsvp/RSVPStep6-3Ceremony.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

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
      <StepLayout
          title="Wedding Ceremony"
          description="Celebrate our love during the wedding ceremony."
      >
        <RsvpEventPage
            eventKey="ceremony"
            nextPage={nextPage}
            previousPage={previousPage}
            isLastEvent={isLastEvent}
        />
      </StepLayout>
  );
};

export default RsvpCeremonyPage;
