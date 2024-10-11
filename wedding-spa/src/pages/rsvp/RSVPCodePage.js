import React, {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../../components/rsvp/CustomInputField";

const RSVPCodePage = () => {
    const navigate = useNavigate();

    const {formData, setFormData, setStep} = useFlow();

    const rsvpCodeInputRef = useRef();
    const lastNameInputRef = useRef();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleNext = () => {
        const isCodeValid = rsvpCodeInputRef.current.validate();
        const isLastNameValid = lastNameInputRef.current.validate();

        if (isCodeValid && isLastNameValid) {
            // Proceed to the next step if all inputs are valid
            setStep((prevStep) => ({...prevStep, rsvpCompleted: true}));
            navigate('/rsvp-info');
        }
    };

    return (
        <RsvpLayout
            title={"RSVP Information"}
            cancel={true}
            children={
                <Form>
                    <CustomInputField
                        ref={rsvpCodeInputRef}
                        name="rsvpCode"
                        type="text"
                        placeholder="Enter your RSVP Code"
                        value={formData.rsvpCode}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={lastNameInputRef}
                        name="lastName"
                        type="text"
                        placeholder="Enter your Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <Button className='rsvp-button dark my-3' onClick={handleNext}> Next </Button>
                </Form>
            }/>
    );
};

export default RSVPCodePage;
