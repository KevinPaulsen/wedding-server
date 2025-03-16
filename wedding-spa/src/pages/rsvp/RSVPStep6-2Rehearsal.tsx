// pages/rsvp/RSVPStep6-2Rehearsal.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

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
      <StepLayout
          title="Rehearsal Dinner"
          description="Enjoy an intimate rehearsal dinner with us."
      >
        <RsvpEventPage
            eventKey="rehearsal"
            nextPage={nextPage}
            previousPage={previousPage}
            isLastEvent={isLastEvent}
        />
      </StepLayout>
  );
};

export default RsvpRehearsalPage;
