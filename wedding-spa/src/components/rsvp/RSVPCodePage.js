import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "./RsvpLayout";
import {Button} from "react-bootstrap";

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
        <RsvpLayout
            title={"RSVP Information"}
            cancel={true}
            children={<>
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

            <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
        </>}/>
    );
};

export default RSVPCodePage;
