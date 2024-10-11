import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/Transitions.css';
import {useFlow} from "../../FlowProvider";
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button} from "react-bootstrap";

const StatusPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(''); // Tracks the selected status ("Yes" or "No")

    const {resetFormData, step, setStep} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.preferredInfoCompleted) {
            navigate('/rsvp-info');
        }
    }, [step, navigate]);

    const handleNext = () => {
        // TODO: send to server

        resetFormData();
        setStep((prevStep) => ({...prevStep, rsvpStatusCompleted: true}));
        navigate('/rsvp-confirmation');
    };

    const handleBack = () => {
        // Logic for going back to the previous page
        navigate('/rsvp-info');
    };

    return (
        <RsvpLayout
            title={"Are you coming?"}
            cancel={true}
            children={<>
            {/* Cards for Yes or No selection */}
            <div className="d-flex justify-content-center my-4">
                {/* Yes card */}
                <div
                    className={`card mx-2 ${status === 'Yes' ? 'bg-dark text-white' : ''}`}
                    style={{width: '150px', cursor: 'pointer'}}
                    onClick={() => setStatus('Yes')}
                >
                    <div className="card-body">
                        <p className="card-title">Yes</p>
                    </div>
                </div>

                {/* No card */}
                <div
                    className={`card mx-2 ${status === 'No' ? 'bg-dark text-white' : ''}`}
                    style={{width: '150px', cursor: 'pointer'}}
                    onClick={() => setStatus('No')}
                >
                    <div className="card-body">
                        <p className="card-title">No</p>
                    </div>
                </div>
            </div>

            {/* Back and Next buttons aligned with the input fields */}
                <div className="d-flex justify-content-between px-3">
                <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                <Button className='rsvp-button dark' onClick={handleNext} disabled={!status}>
                    Submit
                </Button>
            </div>
        </>}/>
    );
};

export default StatusPage;
