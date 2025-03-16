// pages/rsvp/RSVPStep6-3Ceremony.tsx
import React from 'react';
import RsvpEventPage from './RsvpEventPage';
import StepLayout from "./RSVPStepLayout";

interface RsvpCeremonyPageProps {
  nextPage: (formData: any) => void;
  previousPage: (formData: any) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpCeremonyPage: React.FC<RsvpCeremonyPageProps> = ({
                                                             nextPage,
                                                             previousPage,
                                                             requireAnswers,
                                                             returnPage,
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
            requireAnswers={requireAnswers}
            returnPage={returnPage}
        />
      </StepLayout>
  );
};

export default RsvpCeremonyPage;
