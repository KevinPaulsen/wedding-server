import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useFlow} from "../../FlowProvider";
import {Button} from "react-bootstrap";
import '../../styles/rsvp/RsvpButtons.css'

function CancelButton() {
    const navigate = useNavigate();
    const {setStep} = useFlow();

    const handleCancel = () => {
        setStep({
            rsvpCompleted: false,
            preferredInfoCompleted: false,
            rsvpStatusCompleted: false,
        })
        navigate('/');
    };

    return (
        <Button className='rsvp-button dark wire' onClick={() => handleCancel()}>
            Cancel
        </Button>
    )
}

export default CancelButton;