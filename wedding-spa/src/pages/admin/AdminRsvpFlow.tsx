// AdminRsvpFlow.tsx
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Title from "../../components/headerComponents/Title";
import CancelButton from "../../components/rsvpFlow/CancelButton";
import RSVPFormStep from "../../components/rsvpFlow/RsvpFormStep";
import '../../styles/RsvpFlow.css';
import { RSVP_CONFIRMATION_STEP } from "../../components/rsvpFlow/RsvpConfirmation";
import { RSVP_STATUS_STEP } from "../../components/rsvpFlow/RsvpStatusSelector";

const AdminRsvpFlow: React.FC = () => {
    // Adjust the type as needed if these steps are not numbers.
    const [currentStep, setCurrentStep] = useState<number>(RSVP_STATUS_STEP);

    const changePage = (step: number): void => {
        setCurrentStep(step);
    };

    return (
        <Container fluid className="d-flex flex-column vh-100" style={{ backgroundColor: 'var(--main-light)' }}>
            <Row className="g-0 mt-5 text-center align-items-center">
                <Col>
                    <Title link={false} color="default" />
                </Col>
            </Row>

            <Row className="flex-grow-1 align-items-center justify-content-center text-center">
                <Col className="col-12">
                    <RSVPFormStep
                        step={currentStep}
                        changePage={changePage}
                        requireAnswers={false}
                        returnPage="/admin/dashboard"
                    />
                </Col>
            </Row>

            <Row style={{ height: '75px' }} className="pb-3 pt-2 text-center justify-content-center align-items-center">
                {currentStep !== RSVP_CONFIRMATION_STEP && (
                    <Col>
                        <CancelButton route="/admin/dashboard" />
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default AdminRsvpFlow;
