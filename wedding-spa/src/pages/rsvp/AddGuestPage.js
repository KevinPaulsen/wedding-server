import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Form, Row} from "react-bootstrap";
import CustomInputField from "../../components/rsvp/CustomInputField";
import '../../styles/rsvp/RsvpButtons.css'

const AddGuestPage = () => {
    const navigate = useNavigate();
    const {setFormData, step} = useFlow();
    const guestFName = useRef();
    const guestLName = useRef();
    const other = useRef();
    const location = useLocation();

    const [newGuest, setNewGuest] = useState({
        "fName": "",
        "lName": "",
        "foodOption": "",
        "dietaryRestrictions": [],
        "other": "",
    });

    // TODO: Make this not hardcoded
    const dietaryOptions = [
        "VEGAN",
        "SHELLFISH_FREE",
        "DAIRY_FREE",
        "VEGETARIAN",
        "GLUTEN_FREE",
        "NUT_FREE",
        "OTHER"
    ];

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.preferredInfoCompleted) {
            navigate('/rsvp-info');
        }

        if (location.state && location.state.guest) {
            setNewGuest(location.state.guest);
        }
    }, [step, navigate, location.step]);

    const handleChange = (e) => {
        setNewGuest((prevGuest) => ({
            ...prevGuest,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDietaryChange = (option) => {
        setNewGuest((prevGuest) => {
            const updatedRestrictions = prevGuest.dietaryRestrictions.includes(option)
                ? prevGuest.dietaryRestrictions.filter((restriction) => restriction !== option)
                : [...prevGuest.dietaryRestrictions, option];

            return {
                ...prevGuest,
                dietaryRestrictions: updatedRestrictions,
            };
        });
    };

    const handleBack = () => {
        navigate('/rsvp-guests');
    }

    const handleAddGuest = () => {
        const guestNameValid = guestFName.current.validate();
        const guestLNameValid = guestLName.current.validate();

        if (guestNameValid && guestLNameValid) {
            if (location.state && location.state.index !== undefined) {
                // Editing existing guest
                setFormData((prevData) => ({
                    ...prevData,
                    guests: prevData.guests.map((guest, idx) =>
                        idx === location.state.index ? newGuest : guest
                    ),
                }));
            } else {
                // Adding new guest
                setFormData((prevData) => ({
                    ...prevData,
                    guests: [...(prevData.guests || []), newGuest],
                }));
            }

            navigate('/rsvp-guests');
        }
    };

    return (
        <RsvpLayout
            title={"Add Guest"}
            cancel={false}
            children={
                <Form style={{backgroundColor: "darkgray"}}>
                    <CustomInputField
                        ref={guestFName}
                        name="fName"
                        type="text"
                        placeholder="First Name"
                        value={newGuest.fName}
                        onChange={handleChange}
                    />
                    <CustomInputField
                        ref={guestLName}
                        name="lName"
                        type="text"
                        placeholder="Last Name"
                        value={newGuest.lName}
                        onChange={handleChange}
                    />

                    <h4 className="pb-2">Dietary Restrictions</h4>
                    {dietaryOptions.map((option) => (
                        <Button
                            key={option}
                            onClick={() => handleDietaryChange(option)}
                            className={`m-2 rsvp-button rsvp-button width-auto ${
                                newGuest.dietaryRestrictions.includes(option) ? "dark" : "dark wire"
                            }`}
                        >
                            {option.replace('_', ' ')}
                        </Button>
                    ))}

                    {newGuest.dietaryRestrictions.includes("OTHER") ?
                        <div className="pt-2">
                            <CustomInputField
                                ref={other}
                                name="other"
                                type="text"
                                placeholder="Other Restrictions"
                                value={newGuest.other}
                                onChange={handleChange}
                            />
                        </div> : null}

                    <Row className="d-flex justify-content-evenly pt-4 px-2">
                        <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                        <Button className='rsvp-button dark long'
                                onClick={handleAddGuest}> {location.state && location.state.guest ? "Save Changes" : "Add Guest"} </Button>
                    </Row>
                </Form>
            }/>
    );
};

export default AddGuestPage;
