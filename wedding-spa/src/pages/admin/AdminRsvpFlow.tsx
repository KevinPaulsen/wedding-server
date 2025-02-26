// AdminRsvpFlow.tsx
import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import '../../styles/RsvpFlow.css';

const AdminRsvpFlow: React.FC = () => {
    // Adjust the type as needed if these steps are not numbers.
    const [currentStep, setCurrentStep] = useState<number>(0);

    const changePage = (step: number): void => {
        setCurrentStep(step);
    };

    return (
        <Container fluid className="d-flex flex-column vh-100" style={{ backgroundColor: 'var(--main-light)' }}>
        </Container>
    );
};

export default AdminRsvpFlow;
