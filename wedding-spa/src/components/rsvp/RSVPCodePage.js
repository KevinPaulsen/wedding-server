import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import CancelButton from "./CancelButton";
import RsvpLayout from "./RsvpLayout"; // Import the flow context

const RSVPCodePage = () => {
    const navigate = useNavigate();
    const [rsvpCode, setRSVPCode] = useState('');
    const [lastName, setLastName] = useState('');

    const {setStep} = useFlow();

    const handleNext = () => {
        setStep((prevStep) => ({...prevStep, rsvpCompleted: true}));
        navigate('/rsvp-info');
    };

    return (
        <RsvpLayout children={<>
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
        </>}/>
    );
};

export default RSVPCodePage;
