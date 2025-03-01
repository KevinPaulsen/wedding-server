// src/pages/rsvp/RsvpRehearsalPage.tsx
import React from 'react';
import {Button, Form, Table} from 'react-bootstrap';
import {useFlow} from '../../../context/FlowProvider';
import {RSVP_CEREMONY_PAGE, RSVP_GUEST_DETAILS_PAGE, RSVP_REHEARSAL_PAGE, RSVP_ROCE_PAGE} from './RsvpFormStep';
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
                                                                 requireAnswers,
                                                                 returnPage,
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
