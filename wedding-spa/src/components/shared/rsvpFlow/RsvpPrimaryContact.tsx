// RsvpPrimaryContact.tsx
import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/Transitions.css';
import '../../../styles/rsvp/RsvpButtons.css';
import { useFlow } from '../../../context/FlowProvider';
import { Button, Form } from 'react-bootstrap';
import CustomInputField from '../CustomInputField';
import { RSVP_GUESTS_PAGE } from './RsvpGuests';
import { RSVP_ADD_GUEST_STEP } from './RsvpAddGuest';
import { RSVP_STATUS_STEP } from './RsvpStatusSelector';

interface RsvpPrimaryContactProps {
    changePage: (step: number) => void;
    requireAnswers: boolean;
}

interface Validateable {
    validate: () => boolean;
}

const RsvpPrimaryContact: React.FC<RsvpPrimaryContactProps> = ({ changePage, requireAnswers }) => {
    const { formData, updatePreferredContactField, setEditingGuest } = useFlow();

    const prefNameRef = useRef<Validateable>(null);
    const prefEmailRef = useRef<Validateable>(null);
    const prefPhoneRef = useRef<Validateable>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updatePreferredContactField(e.target.name, e.target.value);
    };

    const handleBack = () => {
        changePage(RSVP_STATUS_STEP);
    };

    const handleNext = () => {
        const isNameValid = prefNameRef.current!.validate();
        const isEmailValid = prefEmailRef.current!.validate();
        const isPhoneValid = prefPhoneRef.current!.validate();

        if (isNameValid && isEmailValid && isPhoneValid) {
            if (formData.rsvpGuestDetails.length === 0) {
                setEditingGuest(formData.primaryContact);
                changePage(RSVP_ADD_GUEST_STEP);
            } else {
                changePage(RSVP_GUESTS_PAGE);
            }
        }
    };

    return (
        <Form>
            <CustomInputField
                ref={prefNameRef}
                name="name"
                type="text"
                placeholder="Preferred Name"
                value={formData.primaryContact.name}
                onChange={handleChange}
                required={requireAnswers}
            />
            <CustomInputField
                ref={prefEmailRef}
                name="email"
                type="text"
                placeholder="Preferred Email"
                value={formData.primaryContact.email || ''}
                onChange={handleChange}
                required={requireAnswers}
            />
            <CustomInputField
                ref={prefPhoneRef}
                name="phone"
                type="text"
                placeholder="Preferred Phone Number"
                value={formData.primaryContact.phoneNumber || ''}
                onChange={handleChange}
                required={requireAnswers}
            />

            <div className="d-flex justify-content-evenly px-2">
                <Button className="rsvp-button dark hover" onClick={handleBack}>
                    Back
                </Button>
                <Button className="rsvp-button dark hover" onClick={handleNext}>
                    Next
                </Button>
            </div>
        </Form>
    );
};

export default RsvpPrimaryContact;
export const RSVP_PRIMARY_CONTACT_STEP = 2;
