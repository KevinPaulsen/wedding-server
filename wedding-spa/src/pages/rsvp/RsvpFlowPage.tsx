// RsvpFlowPage.tsx
import React, {useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {CSSTransition} from 'react-transition-group';
import Title from "../../components/main/headerComponents/Title";
import CancelButton from "../../components/shared/rsvpFlow/CancelButton";
import RSVPFormStep, {
    RSVP_CEREMONY_PAGE,
    RSVP_CONFIRMATION_PAGE, RSVP_RECEPTION_PAGE, RSVP_REHEARSAL_PAGE, RSVP_ROCE_PAGE,
    RSVP_VERIFICATION_PAGE
} from "../../components/shared/rsvpFlow/RsvpFormStep";
import '../../styles/RsvpFlow.css';
import {Rsvp} from "../../types/rsvp";

function allowedPage(rsvp: Rsvp, nextStep: number) {
    switch (nextStep) {
        case RSVP_ROCE_PAGE: return rsvp.roce.invited;
        case RSVP_REHEARSAL_PAGE: return rsvp.rehearsal.invited;
        case RSVP_CEREMONY_PAGE: return rsvp.ceremony.invited;
        case RSVP_RECEPTION_PAGE: return rsvp.reception.invited;
        default: return true;
    }
}

const RsvpFlowPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(RSVP_VERIFICATION_PAGE);
    const [displayedStep, setDisplayedStep] = useState<number>(RSVP_VERIFICATION_PAGE);
    const [inProp, setInProp] = useState<boolean>(true);

    const nextPage = (rsvp: Rsvp): void => {
        if (inProp) {
            setInProp(false);

            let nextStep = currentStep + 1;

            while (!allowedPage(rsvp, nextStep)) {
                nextStep = nextStep + 1;
            }

            setCurrentStep(nextStep);
        }
    }

    const previousPage = (rsvp: Rsvp): void => {
        if (inProp) {
            setInProp(false);

            let nextStep = currentStep - 1;

            while (!allowedPage(rsvp, nextStep)) {
                nextStep = nextStep - 1;
            }

            setCurrentStep(nextStep);
        }
    }

    const onExited = (): void => {
        setDisplayedStep(currentStep);
        setInProp(true);
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
                    <CSSTransition in={inProp} timeout={200} classNames="fade" onExited={onExited} unmountOnExit>
                        <RSVPFormStep step={displayedStep} nextPage={nextPage} previousPage={previousPage} />
                    </CSSTransition>
                </Col>
            </Row>

            <Row style={{ height: '75px' }} className="pb-3 pt-2 text-center justify-content-center align-items-center">
                {currentStep !== RSVP_CONFIRMATION_PAGE && (
                    <Col>
                        <CancelButton route="/" />
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default RsvpFlowPage;
