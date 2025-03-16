// pages/rsvp/RSVPStep6-1Roce.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

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
      <StepLayout
          title="Roce Event"
          description="Join us for a memorable Roce experience."
      >
        <RsvpEventPage
            eventKey="roce"
            nextPage={nextPage}
            previousPage={previousPage}
            isLastEvent={isLastEvent}
        />
      </StepLayout>
  );
};

export default RsvpRocePage;
