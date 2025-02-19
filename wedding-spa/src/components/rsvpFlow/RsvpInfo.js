// RsvpInfo.js
import React, {useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {useGetRsvp} from "../../hooks/useGetRsvp";
import {transformGuestDetails} from "../../services/DataTransformService";
import {RSVP_STATUS_STEP} from "./RsvpStatusSelector";

const RsvpInfo = ({changePage}) => {
    const {formData, setFormData, updatePreferredContactField} = useFlow();
    const {getRsvp, rsvp, loading, error} = useGetRsvp();

    const rsvpCodeInputRef = useRef();
    const lastNameInputRef = useRef();

    useEffect(() => {
        if (!loading && !error && rsvp) {
            setFormData({ rsvpStatus: rsvp.rsvpStatus });
            setFormData({ allowedGuestCount: rsvp.allowedGuestCount });
            updatePreferredContactField("name", rsvp.primaryContact.name);
            updatePreferredContactField("email", rsvp.primaryContact.email);
            updatePreferredContactField("phone", rsvp.primaryContact.phoneNumber);
            updatePreferredContactField("address", rsvp.primaryContact.address);
            setFormData({ guests: transformGuestDetails(rsvp.rsvpGuestDetails) });

            changePage(RSVP_STATUS_STEP);
        }
    }, [loading, error, rsvp]);

    const handleNext = async () => {
        const isCodeValid = rsvpCodeInputRef.current.validate();
        const isLastNameValid = lastNameInputRef.current.validate();

        if (isCodeValid && isLastNameValid) {
            getRsvp(formData.rsvpCode, formData.lastname);
        }
    }

    const handleChange = (e) => {
        setFormData({[e.target.name]: e.target.value});
    };

    return (<Form>
        {error && <div className="alert alert-danger">{error}</div>}
        <CustomInputField
                ref={rsvpCodeInputRef}
                name="rsvpCode"
                type="text"
                placeholder="Enter your RSVP Code"
                value={formData.rsvpCode || ''}
                onChange={handleChange}
        />
        <CustomInputField
                ref={lastNameInputRef}
                name="lastname"
                type="text"
                placeholder="Enter your Last Name"
                value={formData.lastname || ''}
                onChange={handleChange}
        />

        <div className="d-flex justify-content-evenly px-2">
            <Button className='rsvp-button width-auto dark hover' onClick={handleNext}>
                {loading ? "Checking RSVP Info" : "Next"}
            </Button>
        </div>
    </Form>);
};

export default RsvpInfo;
export const RSVP_INFO_STEP = 1;
