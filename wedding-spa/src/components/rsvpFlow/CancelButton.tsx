// CancelButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlow } from '../../FlowProvider';
import { Button } from 'react-bootstrap';
import '../../styles/rsvp/RsvpButtons.css';

interface CancelButtonProps {
    route: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ route }) => {
    const navigate = useNavigate();
    const { resetFormData, resetStepState } = useFlow();

    const handleCancel = () => {
        resetFormData();
        resetStepState();
        navigate(route);
    };

    return (
        <Button className='rsvp-button dark wire hover' onClick={handleCancel}>
            Cancel
        </Button>
    );
};

export default CancelButton;
