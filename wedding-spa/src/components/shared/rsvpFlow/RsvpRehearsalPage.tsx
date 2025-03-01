// src/pages/rsvp/RsvpRehearsalPage.tsx
import React from 'react';
import GuestSelection from "./GuestSelection";
import {Rsvp} from "../../../types/rsvp";

interface RsvpRehearsalPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpRehearsalPage: React.FC<RsvpRehearsalPageProps> = ({
                                                                 nextPage,
                                                                 previousPage,
                                                             }) => {
    return (
        <GuestSelection
            eventKey="rehearsal"
            backPage={previousPage}
            nextPage={nextPage}
        />
    );
};

export default RsvpRehearsalPage;
