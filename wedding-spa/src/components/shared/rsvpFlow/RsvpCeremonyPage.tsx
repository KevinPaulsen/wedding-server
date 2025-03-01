// src/pages/rsvp/RsvpCeremonyPage.tsx
import React from 'react';
import {RSVP_RECEPTION_PAGE, RSVP_REHEARSAL_PAGE} from './RsvpFormStep';
import GuestSelection from "./GuestSelection";
import {Rsvp} from "../../../types/rsvp";

interface RsvpCeremonyPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpCeremonyPage: React.FC<RsvpCeremonyPageProps> = ({
                                                               nextPage,
                                                               previousPage,
                                                           }) => {
    return (
        <GuestSelection
            eventKey="ceremony"
            backPage={previousPage}
            nextPage={nextPage}
        />
    );
};

export default RsvpCeremonyPage;
