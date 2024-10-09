import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useFlow} from "../../FlowProvider";
import {Button} from "react-bootstrap";
import '../../styles/rsvp/RsvpButtons.css'
import {useFormContext} from "./FormContext";

function CancelButton() {
    const navigate = useNavigate();
    const {setStep} = useFlow();
    const {setFormData} = useFormContext();

    const handleCancel = () => {
        setStep({
            rsvpCompleted: false,
            preferredInfoCompleted: false,
            rsvpStatusCompleted: false,
        })
        setFormData({
            rsvpCode: '',
            lastName: '',
            prefName: '',
            prefEmail: '',
            prefPhone: '',
        });
        navigate('/');
    };

    return (
        <Button className='rsvp-button dark wire' onClick={() => handleCancel()}>
            Cancel
        </Button>
    )
}

export default CancelButton;