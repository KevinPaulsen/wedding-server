import React, {useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {CSSTransition} from 'react-transition-group';
import Title from "../../components/headerComponents/Title";
import CancelButton from "../../components/rsvpFlow/CancelButton";
import RSVPFormStep from "../../components/rsvpFlow/RsvpFormStep";
import '../../styles/RsvpFlow.css'
import {RSVP_INFO_STEP} from "../../components/rsvpFlow/RsvpInfo";
import {RSVP_CONFIRMATION_STEP} from "../../components/rsvpFlow/RsvpConfirmation";

const RsvpFlow = () => {
    const [currentStep, setCurrentStep] = useState(RSVP_INFO_STEP);
    const [displayedStep, setDisplayedStep] = useState(RSVP_INFO_STEP);
    const [inProp, setInProp] = useState(true);

    const changePage = (step) => {
        if (inProp) {
            setInProp(false);
            setCurrentStep(step);
        }
    }

    const onExited = () => {
        setDisplayedStep(currentStep);
        setInProp(true);
    };

    return (
        <Container fluid className="d-flex flex-column vh-100" style={{backgroundColor: 'var(--main-light)'}}>
            <Row className='g-0 mt-5 text-center align-items-center'>
                <Col>
                    <Title/>
                </Col>
            </Row>

            <Row className="flex-grow-1 align-items-center justify-content-center text-center">
                <Col className="col-12">
                    <CSSTransition
                        in={inProp}
                        timeout={200}
                        classNames="fade"
                        onExited={onExited}
                        unmountOnExit
                    >
                        <RSVPFormStep
                            step={displayedStep}
                            changePage={changePage}
                        />
                    </CSSTransition>
                </Col>
            </Row>

            <Row style={{height: '75px'}} className='pb-3 pt-2 text-center justify-content-center align-items-center'>
                {currentStep !== RSVP_CONFIRMATION_STEP &&
                    <Col>
                        <CancelButton route="/"/>
                    </Col>}
            </Row>
        </Container>
    );
};

export default RsvpFlow;
