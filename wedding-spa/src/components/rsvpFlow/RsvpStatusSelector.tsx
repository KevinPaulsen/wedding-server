// RsvpStatusSelector.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import { useFlow } from '../../FlowProvider';
import { Button, Form, Row } from 'react-bootstrap';
import { RSVP_PRIMARY_CONTACT_STEP } from './RsvpPrimaryContact';
import { usePutRsvp } from '../../hooks/usePutRsvp';
import { RSVP_CONFIRMATION_STEP } from './RsvpConfirmation';
import { useNavigate } from 'react-router-dom';

interface RsvpStatusProps {
    changePage: (step: number) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpStatus: React.FC<RsvpStatusProps> = ({ changePage, requireAnswers, returnPage }) => {
    const { formData, setFormData, resetFormData, resetStepState } = useFlow();
    const [selectedStatus, setSelectedStatus] = useState<string | null>(formData.rsvpStatus);
    const { putRsvp, error, loading } = usePutRsvp();
    const navigate = useNavigate();

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setFormData({ rsvpStatus: status });
    };

    const handleNext = async () => {
        if (!requireAnswers || (selectedStatus && formData.rsvpStatus)) {
            if (!requireAnswers || formData.rsvpStatus === 'ATTENDING') {
                changePage(RSVP_PRIMARY_CONTACT_STEP);
            } else {
                const putRsvpDto = {
                    rsvpCode: formData.rsvpCode,
                    lastName: formData.lastname,
                    rsvpStatus: formData.rsvpStatus,
                };

                const data = await putRsvp(putRsvpDto);

                if ((!error || error === '') && data) {
                    resetFormData();

                    if (!returnPage) {
                        changePage(RSVP_CONFIRMATION_STEP);
                    } else {
                        resetStepState();
                        navigate(returnPage);
                    }
                }
            }
        }
    };

    return (
        <Form>
            {error && <div className="alert alert-danger">{error}</div>}
            <Row className="d-flex justify-content-center">
                <Button
                    className={`m-2 rsvp-status-button ${selectedStatus === 'ATTENDING' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('ATTENDING')}
                    variant=""
                >
                    Yes, I am coming
                </Button>
                <Button
                    className={`m-2 rsvp-status-button ${selectedStatus === 'NOT_ATTENDING' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('NOT_ATTENDING')}
                    variant=""
                >
                    No, I am not coming
                </Button>
            </Row>
            <Row className="d-flex justify-content-center pt-4">
                <Button className='rsvp-button dark hover' onClick={handleNext} disabled={!selectedStatus}>
                    Next
                </Button>
            </Row>
        </Form>
    );
};

export default RsvpStatus;
export const RSVP_STATUS_STEP = 6;
