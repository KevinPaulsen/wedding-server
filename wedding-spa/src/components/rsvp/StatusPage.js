import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/Transitions.css';
import {useFlow} from "../../FlowProvider";
import CancelButton from "./CancelButton";

const StatusPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(''); // Tracks the selected status ("Yes" or "No")

    const {step, setStep} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.preferredInfoCompleted) {
            navigate('/rsvp-info');
        }
    }, [step, navigate]);

    const handleNext = () => {
        // Logic for when the user hits Next
        setStep((prevStep) => ({...prevStep, rsvpStatusCompleted: true}));
        navigate('/rsvp-confirmation');
    };

    const handleBack = () => {
        // Logic for going back to the previous page
        navigate('/rsvp-info');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: 'ivory'}}>
            <div className="position-absolute top-0 start-0 m-4">
                <CancelButton/>
            </div>

            {/* Container for the status selection cards and buttons */}
            <div className="text-center fade-in">
                <p>Are You Coming?</p>

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
                <div className="d-flex justify-content-between mt-3" style={{maxWidth: '300px', margin: '0 auto'}}>
                    <button className="btn btn-dark" onClick={handleBack}>
                        Back
                    </button>
                    <button className="btn btn-dark" onClick={handleNext} disabled={!status}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
