import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form, Row} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {RSVP_GUESTS_PAGE} from "./RsvpGuests";

const RsvpAddGuest = ({ changePage, requireAnswers }) => {
    const {setFormData, editingGuest, setEditingGuest} = useFlow();
    const guestName = useRef();
    const other = useRef();

    const [newGuest, setNewGuest] = useState({
        "name": "",
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

    useEffect(() => {
        if (editingGuest) {
            setNewGuest(editingGuest);
        }
    }, [editingGuest]);

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
        setEditingGuest(null);
        changePage(RSVP_GUESTS_PAGE);
    }

    const handleAddGuest = () => {
        const guestNameValid = guestName.current.validate();

        if (guestNameValid) {
            setFormData((prevData) => {
                let updatedGuests;
                if (editingGuest && editingGuest.index) {
                    updatedGuests = prevData.guests.map((guest, idx) => idx === editingGuest.index ? newGuest : guest);
                } else {
                    updatedGuests = [...(prevData.guests || []), newGuest];
                }

                return {...prevData, guests: updatedGuests};
            });

            setEditingGuest(null);
            changePage(RSVP_GUESTS_PAGE)
        }
    };


    return (
        <Form>
            <CustomInputField
                ref={guestName}
                name="name"
                type="text"
                placeholder="Guest full name"
                value={newGuest.name}
                onChange={handleChange}
                required={requireAnswers}
            />

            <h4 className="pb-2">Dietary Restrictions</h4>
            {dietaryOptions.map((option) => (
                <Button
                    key={option}
                    onClick={() => handleDietaryChange(option)}
                    className={`m-2 rsvp-button width-auto ${
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
                        required={requireAnswers}
                    />
                </div> : null}

            <Row className="d-flex justify-content-evenly pt-4 px-2">
                <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                <Button className='rsvp-button dark long'
                        onClick={handleAddGuest}>
                    {editingGuest ? 'Save Changes' : 'Add Guest'}
                </Button>
            </Row>
        </Form>
    );
};

export default RsvpAddGuest;
export const RSVP_ADD_GUEST_STEP = 4;
