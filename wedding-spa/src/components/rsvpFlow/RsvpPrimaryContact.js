import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {RSVP_GUESTS_PAGE} from "./RsvpGuests";
import {RSVP_ADD_GUEST_STEP} from "./RsvpAddGuest";
import {RSVP_STATUS_STEP} from "./RsvpStatusSelector";

const RsvpPrimaryContact = ({changePage, requireAnswers}) => {
    const {formData, updatePreferredContactField, setEditingGuest} = useFlow();

    const prefNameRef = useRef();
    const prefEmailRef = useRef();
    const prefPhoneRef = useRef();

    const handleChange = (e) => {
        updatePreferredContactField(e.target.name, e.target.value);
    };

    const handleBack = () => {
        changePage(RSVP_STATUS_STEP);
    };

    const handleNext = () => {
        const isCodeValid = prefNameRef.current.validate();
        const isEmailValid = prefEmailRef.current.validate();
        const isPhoneValid = prefPhoneRef.current.validate();

        if (isCodeValid && isEmailValid && isPhoneValid) {
            if (formData.guests && formData.guests.length === 0) {
                setEditingGuest({
                                    "name": formData.preferredContact.name,
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

    return (<Form>
        <CustomInputField
                ref={prefNameRef}
                name="name"
                type="text"
                placeholder="Preferred Name"
                value={formData.preferredContact.name || ''}
                onChange={handleChange}
                required={requireAnswers}
        />
        <CustomInputField
                ref={prefEmailRef}
                name="email"
                type="text"
                placeholder="Preferred Email"
                value={formData.preferredContact.email || ''}
                onChange={handleChange}
                required={requireAnswers}
        />
        <CustomInputField
                ref={prefPhoneRef}
                name="phone"
                type="text"
                placeholder="Preferred Phone Number"
                value={formData.preferredContact.phone || ''}
                onChange={handleChange}
                required={requireAnswers}
        />

        <div className="d-flex justify-content-evenly px-2">
            <Button className="rsvp-button dark hover" onClick={handleBack}> Back </Button>
            <Button className='rsvp-button dark hover' onClick={handleNext}> Next </Button>
        </div>
    </Form>);
};

export default RsvpPrimaryContact;
export const RSVP_PRIMARY_CONTACT_STEP = 2;
