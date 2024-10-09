import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Form} from "react-bootstrap";
import {useFormContext} from "../../components/rsvp/FormContext";
import CustomInputField from "../../components/rsvp/CustomInputField";

const PreferredInfoPage = () => {
    const navigate = useNavigate();
    const [preferredName, setPreferredName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const {formData, setFormData} = useFormContext();

    const {step, setStep} = useFlow();
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
            navigate('/rsvp-status');
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
                        placeholder="Enter your Preferred Name"
                        value={formData.prefName}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={prefEmailRef}
                        name="prefEmail"
                        type="text"
                        placeholder="Enter your Preferred Email"
                        value={formData.prefEmail}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={prefPhoneRef}
                        name="prefPhone"
                        type="text"
                        placeholder="Enter your Preferred Phone Number"
                        value={formData.prefPhone}
                        onChange={handleChange}
                    />
                    <div className="d-flex justify-content-between mt-3 px-2">
                        <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                        <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
                    </div>
                </Form>
            }/>
    );
};

export default PreferredInfoPage;

