// pages/rsvp/RSVPStep6-2Rehearsal.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

interface RsvpRehearsalPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpRehearsalPage: React.FC<RsvpRehearsalPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               requireAnswers,
                                                               returnPage,
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
            requireAnswers={requireAnswers}
            returnPage={returnPage}
        />
      </StepLayout>
  );
};

export default RsvpRehearsalPage;
