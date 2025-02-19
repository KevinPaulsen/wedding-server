// RsvpConfirmation.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/Transitions.css';
import '../../../styles/rsvp/RsvpButtons.css';
import { Button } from 'react-bootstrap';
import { useFlow } from '../../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';

const RsvpConfirmation: React.FC = () => {
    const { resetStepState } = useFlow();
    const navigate = useNavigate();

    const goHome = () => {
        resetStepState();
        navigate('/');
    };

    return (
        <>
            <p>Your RSVP has been submitted.</p>
            <Button className='rsvp-button width-auto dark hover' onClick={goHome}>
                Return Home
            </Button>
        </>
    );
};

export default RsvpConfirmation;
export const RSVP_CONFIRMATION_STEP = 5;
