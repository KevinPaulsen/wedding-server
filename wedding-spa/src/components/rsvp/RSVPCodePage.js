import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider'; // Import the flow context

const RSVPCodePage = () => {
    const navigate = useNavigate();
    const [rsvpCode, setRSVPCode] = useState('');
    const [lastName, setLastName] = useState('');

    const {setStep} = useFlow();

    const handleNext = () => {
        setStep((prevStep) => ({...prevStep, rsvpCompleted: true}));
        navigate('/rsvp-info');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: 'ivory'}}>
            <div className="position-absolute top-0 start-0 m-4">
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                    Cancel
                </button>
            </div>

            <div className="text-center fade-in">

                <input
                    type="text"
                    className="form-control my-3"
                    placeholder="RSVP Code"
                    value={rsvpCode}
                    onChange={(e) => setRSVPCode(e.target.value)}
                    style={{maxWidth: '300px', margin: '0 auto'}}
                />

                <input
                    type="text"
                    className="form-control my-3"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{maxWidth: '300px', margin: '0 auto'}}
                />

                <button className="btn btn-dark mt-3" onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default RSVPCodePage;
