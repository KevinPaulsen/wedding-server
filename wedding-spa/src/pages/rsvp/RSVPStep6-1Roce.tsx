// pages/rsvp/RSVPStep6-1Roce.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

interface RsvpRocePageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpRocePage: React.FC<RsvpRocePageProps> = ({
                                                     nextPage,
                                                     previousPage,
                                                     requireAnswers,
                                                     returnPage,
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
            requireAnswers={requireAnswers}
            returnPage={returnPage}
        />
      </StepLayout>
  );
};

export default RsvpRocePage;
