// pages/rsvp/RSVPStep6-4Reception.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

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
      <StepLayout
          title="Wedding Reception"
          description="Dance the night away at our wedding reception."
      >
        <RsvpEventPage
            eventKey="reception"
            nextPage={nextPage}
            previousPage={previousPage}
            isLastEvent={isLastEvent}
        />
      </StepLayout>
  );
};

export default RsvpReceptionPage;
