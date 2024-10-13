import React, {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../../components/rsvp/CustomInputField";

const PreferredInfoPage = () => {
    const navigate = useNavigate();

    const {formData, setFormData, step, setStep} = useFlow();
    const prefNameRef = useRef();
    const prefEmailRef = useRef();
    const prefPhoneRef = useRef();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.rsvpCompleted) {
            navigate('/rsvp');
        }
    }, [step, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleNext = () => {
        const isCodeValid = prefNameRef.current.validate();
        const isEmailValid = prefEmailRef.current.validate();
        const isPhoneValid = prefPhoneRef.current.validate();

        if (isCodeValid && isEmailValid && isPhoneValid) {
            setStep((prevStep) => ({...prevStep, preferredInfoCompleted: true}));
            navigate('/rsvp-guests');
        }
    };

    const handleBack = () => {
        navigate('/rsvp');
    };

    return (
        <RsvpLayout
            title={"Preferred Contact"}
            cancel={true}
            children={
                <Form>
                    <CustomInputField
                        ref={prefNameRef}
                        name="prefName"
                        type="text"
                        placeholder="Preferred Name"
                        value={formData.prefName}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={prefEmailRef}
                        name="prefEmail"
                        type="text"
                        placeholder="Preferred Email"
                        value={formData.prefEmail}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={prefPhoneRef}
                        name="prefPhone"
                        type="text"
                        placeholder="Preferred Phone Number"
                        value={formData.prefPhone}
                        onChange={handleChange}
                    />
                    <div className="d-flex justify-content-evenly px-2">
                        <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                        <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
                    </div>
                </Form>
            }/>
    );
};

export default PreferredInfoPage;

