// src/pages/rsvp/RsvpConfirmation.tsx
import React from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {Rsvp} from "../../../types/rsvp";

interface RsvpConfirmationProps {
    returnPage?: string | null;
}

const RsvpConfirmation: React.FC<RsvpConfirmationProps> = ({ returnPage }) => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        if (!returnPage) {
            navigate('/');
        } else {
            navigate(returnPage);
        }
    };

    return (
        <div className="p-3 text-center">
            <p>Your RSVP has been successfully submitted.</p>
            <Button className="rsvp-button width-auto dark hover"  onClick={handleReturnHome}>Return Home</Button>
        </div>
    );
};

export default RsvpConfirmation;
