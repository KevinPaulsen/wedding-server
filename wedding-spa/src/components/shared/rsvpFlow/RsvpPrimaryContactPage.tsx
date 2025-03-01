// src/pages/rsvp/RsvpPrimaryContactPage.tsx
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import CustomInputField from '../CustomInputField';
import { useFlow } from '../../../context/FlowProvider';
import { RSVP_GUEST_DETAILS_PAGE, RSVP_VERIFICATION_PAGE } from './RsvpFormStep';
import { Rsvp } from "../../../types/rsvp";
import CustomButton from "../CustomButton";

interface RsvpPrimaryContactPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpPrimaryContactPage: React.FC<RsvpPrimaryContactPageProps> = ({
                                                                           nextPage,
                                                                           previousPage,
                                                                           requireAnswers,
                                                                           returnPage,
                                                                       }) => {
    const { formData, setFormData } = useFlow();
    const nameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const addressRef = useRef<any>(null);
    const phoneRef = useRef<any>(null);

    // Get the primary contact key which is assumed to be a key of the guest_list.
    const primaryContactKey = formData.primary_contact?.name;
    // Look up the guest's display name using that key.
    const primaryGuestDisplayName =
        primaryContactKey && formData.guest_list?.[primaryContactKey]
            ? formData.guest_list[primaryContactKey].display_name
            : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "name") {
            // Update the display name for the primary contact in the guest list.
            if (primaryContactKey && formData.guest_list?.[primaryContactKey]) {
                setFormData({
                    ...formData,
                    guest_list: {
                        ...formData.guest_list,
                        [primaryContactKey]: {
                            ...formData.guest_list[primaryContactKey],
                            display_name: e.target.value,
                        },
                    },
                });
            }
        } else {
            // For other fields (email, address, phone) update primary_contact normally.
            setFormData({
                ...formData,
                primary_contact: {
                    ...formData.primary_contact,
                    [e.target.name]: e.target.value,
                },
            });
        }
    };

    const handleBack = () => {
        previousPage(formData);
    };

    const handleNext = () => {
        const validName = nameRef.current.validate();
        const validEmail = emailRef.current.validate();
        const validAddress = addressRef.current.validate();
        const validPhone = phoneRef.current.validate();

        if (validName && validEmail && validAddress && validPhone) {
            nextPage(formData);
        }
    };

    return (
        <div className="p-3">
            <Form>
                <CustomInputField
                    ref={nameRef}
                    name="name"
                    placeholder="Full Name"
                    value={primaryGuestDisplayName}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={emailRef}
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.primary_contact?.email ?? ''}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={addressRef}
                    name="address"
                    placeholder="Address"
                    value={formData.primary_contact?.address ?? ''}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={phoneRef}
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.primary_contact?.phone_number ?? ''}
                    onChange={handleChange}
                    required={requireAnswers}
                />

                <div className="d-flex justify-content-evenly px-2">
                    <CustomButton
                        text="Back"
                        onClick={handleBack}
                        variant="dark"
                        width="75px"
                    />
                    <CustomButton
                        text="Next"
                        onClick={handleNext}
                        variant="dark"
                        width="75px"
                    />
                </div>
            </Form>
        </div>
    );
};

export default RsvpPrimaryContactPage;
