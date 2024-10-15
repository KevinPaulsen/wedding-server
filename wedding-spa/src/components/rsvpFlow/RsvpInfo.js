import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {RSVP_PRIMARY_CONTACT_STEP} from "./RsvpPrimaryContact";

const RsvpInfo = ({changePage}) => {
    const {formData, setFormData} = useFlow();

    const rsvpCodeInputRef = useRef();
    const lastNameInputRef = useRef();

    const handleNext = () => {
        const isCodeValid = rsvpCodeInputRef.current.validate();
        const isLastNameValid = lastNameInputRef.current.validate();

        if (isCodeValid && isLastNameValid) {
            changePage(RSVP_PRIMARY_CONTACT_STEP)
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
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

            <div className="d-flex justify-content-evenly px-2">
                <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
            </div>
        </Form>
    );
};

export default RsvpInfo;
export const RSVP_INFO_STEP = 1;
