import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useFlow} from "../../FlowProvider";
import {Button} from "react-bootstrap";
import '../../styles/rsvp/RsvpButtons.css'

function CancelButton() {
    const navigate = useNavigate();
    const {resetFormData, resetStepState} = useFlow();

    const handleCancel = () => {
        resetFormData();
        resetStepState();
        navigate('/');
    };

    return (
        <Button className='rsvp-button dark wire' onClick={() => handleCancel()}>
            Cancel
        </Button>
    )
}

export default CancelButton;