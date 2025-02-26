// src/pages/rsvp/RsvpConfirmation.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RsvpConfirmation: React.FC = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="p-3 text-center">
            <h3>Thank You!</h3>
            <p>Your RSVP has been successfully submitted.</p>
            <Button onClick={handleReturnHome}>Return Home</Button>
        </div>
    );
};

export default RsvpConfirmation;
