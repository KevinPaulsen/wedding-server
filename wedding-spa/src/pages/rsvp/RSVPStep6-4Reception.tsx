// pages/rsvp/RSVPStep6-4Reception.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

interface RsvpReceptionPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpReceptionPage: React.FC<RsvpReceptionPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                               requireAnswers,
                                                               returnPage,
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
            requireAnswers={requireAnswers}
            returnPage={returnPage}
        />
      </StepLayout>
  );
};

export default RsvpReceptionPage;
