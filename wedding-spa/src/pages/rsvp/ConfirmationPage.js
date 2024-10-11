import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from "../../FlowProvider";
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button} from "react-bootstrap";

const ConfirmationPage = () => {
    const navigate = useNavigate();

    const {step, setStep, resetStepState} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.rsvpStatusCompleted) {
            navigate('/rsvp-status');
        } else {
            setStep(prevStep => ({...prevStep, rsvpStatusCompleted: true}));
        }
    }, [step, navigate]);

    const goHome = () => {
        resetStepState();
        navigate('/');
    };

    return (
        <RsvpLayout
            title={"Thank you or your Response!"}
            cancel={false}
            children={<>
            <p>Your RSVP has been submitted.</p>
            <Button className='rsvp-button long dark' onClick={goHome}>
                Return Home
            </Button>
        </>}/>
    );
};

export default ConfirmationPage;
