import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Form, Row} from "react-bootstrap";
import CustomInputField from "../../components/rsvp/CustomInputField";

const AddGuestPage = () => {
    const navigate = useNavigate();

    const {formData, setFormData, step, setStep, addGuest} = useFlow();
    const guestName = useRef();
    const [newGuest, setNewGuest] = useState({
        "name": "",
        "foodOption": "",
        "dietaryRestrictions": [],
        "other": "",
    });

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.preferredInfoCompleted) {
            navigate('/rsvp-info');
        }

        //addGuest(newGuest);
    }, [step, navigate]);

    const handleChange = (e) => {
        setNewGuest((prevGuest) => ({
            ...prevGuest,
            [e.target.name]: e.target.value,
        }));
    };

    const handleBack = () => {
        navigate('/rsvp-guests');
    }

    const handleAddGuest = () => {
        const guestNameValid = guestName.current.validate();

        if (guestNameValid) {
            setFormData((prevData) => ({
                ...prevData,
                guests: [...(prevData.guests || []), newGuest],
            }));

            navigate('/rsvp-guests');
        }
    };

    return (
        <RsvpLayout
            title={"Add Guest"}
            cancel={false}
            children={
                <Form>
                    <CustomInputField
                        ref={guestName}
                        name="name"
                        type="text"
                        placeholder="Guest Name"
                        value={newGuest.name}
                        onChange={handleChange}
                    />
                    <Row className="d-flex justify-content-between px-2">
                        <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                        <Button className='rsvp-button dark long' onClick={handleAddGuest}> Add Guest </Button>
                    </Row>
                </Form>
            }/>
    );
};

export default AddGuestPage;
