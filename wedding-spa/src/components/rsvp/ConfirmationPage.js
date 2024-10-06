import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from "../../FlowProvider";
import RsvpLayout from "./RsvpLayout";
import {Button} from "react-bootstrap";

const ConfirmationPage = () => {
    const navigate = useNavigate();

    const {step, setStep} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.rsvpStatusCompleted) {
            navigate('/rsvp-status');
        } else {
            setStep({
                rsvpCompleted: false,
                preferredInfoCompleted: false,
                rsvpStatusCompleted: true,
            });
        }
    }, [step, navigate]);

    const goHome = () => {
        setStep({
            rsvpCompleted: false,
            preferredInfoCompleted: false,
            rsvpStatusCompleted: false,
        })
        navigate('/');
    };

    return (
        <RsvpLayout cancel={false} children={
            <div className="text-center fade-in">
                <p>Thank You for Your Response!</p>
                <p>Your RSVP has been submitted.</p>
                <Button className='rsvp-button long dark' onClick={goHome}>
                    Return Home
                </Button>
            </div>
        }/>
    );
};

export default ConfirmationPage;
