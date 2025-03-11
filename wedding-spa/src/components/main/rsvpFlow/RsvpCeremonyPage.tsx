// components/shared/rsvpFlow/RsvpCeremonyPage.tsx
import React from 'react';
import GuestSelection from "./GuestSelection";
import {Rsvp} from "../../../types/rsvp";

interface RsvpCeremonyPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpCeremonyPage: React.FC<RsvpCeremonyPageProps> = ({ nextPage, previousPage }) => {
    return (
        <GuestSelection
            eventKey="ceremony"
            backPage={previousPage}
            nextPage={nextPage}
        />
    );
};

export default RsvpCeremonyPage;
