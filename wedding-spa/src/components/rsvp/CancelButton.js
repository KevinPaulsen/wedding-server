import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useFlow} from "../../FlowProvider";

function CancelButton() {
    const navigate = useNavigate();
    const {setStep} = useFlow();

    const handleCancel = () => {
        navigate('/');
        setStep({
            rsvpCompleted: false,
            preferredInfoCompleted: false,
            rsvpStatusCompleted: false,
        })
    };

    return (
        <button className="btn btn-outline-secondary" onClick={handleCancel}>
            Cancel
        </button>
    )
}

export default CancelButton;