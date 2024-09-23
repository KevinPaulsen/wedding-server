import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from "../../FlowProvider";

const ConfirmationPage = () => {
    const navigate = useNavigate();

    const {step} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.rsvpStatusCompleted) {
            navigate('/rsvp-status');
        }
    }, [step, navigate]);

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100"
             style={{backgroundColor: 'ivory'}}>

            <div className="text-center fade-in">
                <p>Thank You for Your Response!</p>
                <p>Your RSVP has been submitted.</p>
                <button className="btn btn-dark" onClick={goHome}>
                    Return Home
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
