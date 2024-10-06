import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import CancelButton from "./CancelButton";
import RsvpLayout from "./RsvpLayout"; // Import the flow context

const PreferredInfoPage = () => {
    const navigate = useNavigate();
    const [preferredName, setPreferredName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const {step, setStep} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.rsvpCompleted) {
            navigate('/rsvp');
        }
    }, [step, navigate]);

    const handleNext = () => {
        setStep((prevStep) => ({...prevStep, preferredInfoCompleted: true}));
        navigate('/rsvp-status');
    };

    const handleBack = () => {
        navigate('/rsvp');
    };

    return (
        <RsvpLayout children={<>
            {/* Form in the center */}
            <div className="text-center fade-in">

                <input
                    type="text"
                    className="form-control my-3"
                    placeholder="Preferred Name"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    style={{maxWidth: '300px', margin: '0 auto'}}
                />

                <input
                    type="email"
                    className="form-control my-3"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{maxWidth: '300px', margin: '0 auto'}}
                />

                <input
                    type="tel"
                    className="form-control my-3"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{maxWidth: '300px', margin: '0 auto'}}
                />

                <div className="d-flex justify-content-between mt-3" style={{maxWidth: '300px', margin: '0 auto'}}>
                    <button className="btn btn-dark" onClick={handleBack}>
                        Back
                    </button>
                    <button className="btn btn-dark" onClick={handleNext}>
                        Next
                    </button>
                </div>
            </div>
        </>}/>
    );
};

export default PreferredInfoPage;

