import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Form} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import {RSVP_PRIMARY_CONTACT_STEP} from "./RsvpPrimaryContact";
import {useGetRsvp} from "../../hooks/useGetRsvp";
import {transformGuestDetails} from "../../services/DataTransformService";

const RsvpInfo = ({changePage}) => {
    const {formData, setFormData} = useFlow();
    const {getRsvp, loading, error} = useGetRsvp();

    const rsvpCodeInputRef = useRef();
    const lastNameInputRef = useRef();

    const handleNext = async () => {
        const isCodeValid = rsvpCodeInputRef.current.validate();
        const isLastNameValid = lastNameInputRef.current.validate();

        if (isCodeValid && isLastNameValid) {
            const rsvp = await getRsvp(formData.rsvpCode, formData.lastName);

            if (!error) {
                setFormData({
                                ...formData,
                                prefName: rsvp.primaryContact.name,
                                prefEmail: rsvp.primaryContact.email,
                                prefPhone: rsvp.primaryContact.phoneNumber,
                                guests: transformGuestDetails(rsvp.rsvpGuestDetails),
                            });
                changePage(RSVP_PRIMARY_CONTACT_STEP)
            }
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (<Form>
                {error && <div className="alert alert-danger">{error}</div>}
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
                    <Button className='rsvp-button width-auto dark' onClick={handleNext}>
                        {loading ? "Checking RSVP Info" : "Next"}
                    </Button>
                </div>
            </Form>);
};

export default RsvpInfo;
export const RSVP_INFO_STEP = 1;
