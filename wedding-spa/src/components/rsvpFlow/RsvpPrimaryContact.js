import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {RSVP_GUESTS_PAGE} from "./RsvpGuests";
import {RSVP_ADD_GUEST_STEP} from "./RsvpAddGuest";

const RsvpPrimaryContact = ({changePage, requireAnswers}) => {
    const {formData, setFormData, setEditingGuest} = useFlow();

    const prefNameRef = useRef();
    const prefEmailRef = useRef();
    const prefPhoneRef = useRef();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleNext = () => {
        const isCodeValid = prefNameRef.current.validate();
        const isEmailValid = prefEmailRef.current.validate();
        const isPhoneValid = prefPhoneRef.current.validate();

        if (isCodeValid && isEmailValid && isPhoneValid) {
            console.log(formData.guests);
            console.log(formData.guests && formData.guests.length === 0);
            if (formData.guests && formData.guests.length === 0) {
                setEditingGuest({
                                    "name": formData.prefName,
                                    "foodOption": "",
                                    "dietaryRestrictions": [],
                                    "other": "",
                });
                changePage(RSVP_ADD_GUEST_STEP);
            } else {
                changePage(RSVP_GUESTS_PAGE);
            }
        }
    }

    return (
        <Form>
            <CustomInputField
                ref={prefNameRef}
                name="prefName"
                type="text"
                placeholder="Preferred Name"
                value={formData.prefName}
                onChange={handleChange}
                required={requireAnswers}
            />
            <CustomInputField
                ref={prefEmailRef}
                name="prefEmail"
                type="text"
                placeholder="Preferred Email"
                value={formData.prefEmail}
                onChange={handleChange}
                required={requireAnswers}
            />
            <CustomInputField
                ref={prefPhoneRef}
                name="prefPhone"
                type="text"
                placeholder="Preferred Phone Number"
                value={formData.prefPhone}
                onChange={handleChange}
                required={requireAnswers}
            />

            <div className="d-flex justify-content-evenly px-2">
                <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
            </div>
        </Form>
    );
};

export default RsvpPrimaryContact;
export const RSVP_PRIMARY_CONTACT_STEP = 2;
