import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {Button} from "react-bootstrap";
import {useFlow} from "../../FlowProvider";
import {useNavigate} from "react-router-dom";

const RsvpConfirmation = () => {
    const {resetStepState, resetFormData} = useFlow();
    const navigate = useNavigate();

    const goHome = () => {
        resetStepState();
        resetFormData();
        navigate('/');
    };

    return (
        <>
            <p>Your RSVP has been submitted.</p>
            <Button className='rsvp-button long dark' onClick={goHome}>
                Return Home
            </Button>
        </>
    );
};

export default RsvpConfirmation;
export const RSVP_CONFIRMATION_STEP = 5;
