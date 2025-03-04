// src/pages/rsvp/RsvpPrimaryContactPage.tsx
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import CustomInputField from '../CustomInputField';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp } from "../../../types/rsvp";
import CustomButton from "../CustomButton";
// Import MUI components for Autocomplete
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

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
                                                                       }) => {
    const { formData, setFormData } = useFlow();
    // Remove the nameRef since primary contact is now an Autocomplete field
    const emailRef = useRef<any>(null);
    const addressRef = useRef<any>(null);
    const phoneRef = useRef<any>(null);

    // Get the primary contact key, which is assumed to be a key of the guest_list.
    const primaryContactKey = formData.primary_contact?.name;
    // Get the primary guest's display name from guest_list.
    const primaryGuestDisplayName =
        primaryContactKey && formData.guest_list?.[primaryContactKey]
            ? formData.guest_list[primaryContactKey].display_name
            : '';

    // Build options for the Autocomplete from the guest_list.
    const primaryOptions = Object.entries(formData.guest_list || {}).map(([key, guest]) => ({
        id: key,
        label: guest.display_name,
    }));

    // Update primary contact field
    const handlePrimaryChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            primary_contact: {
                ...formData.primary_contact,
                [field]: value,
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // This handler is for the other fields (email, address, phone)
        setFormData({
            ...formData,
            primary_contact: {
                ...formData.primary_contact,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleBack = () => {
        previousPage(formData);
    };

    const handleNext = () => {
        const validEmail = emailRef.current.validate();
        const validAddress = addressRef.current.validate();
        const validPhone = phoneRef.current.validate();

        // Ensure primary contact is selected along with other valid fields.
        if (formData.primary_contact?.name && validEmail && validAddress && validPhone) {
            nextPage(formData);
        }
    };

    // New submit handler for the form.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNext();
    };

    return (
        <div className="p-3">
            <Form onSubmit={handleSubmit}>
                {/* Primary Contact Autocomplete */}
                <Box sx={{ pt: 0, pb: 1, display: 'flex', justifyContent: 'center' }}>
                    <Autocomplete
                        options={primaryOptions}
                        value={
                            formData.primary_contact?.name && formData.guest_list?.[formData.primary_contact.name]
                                ? {
                                    id: formData.primary_contact.name,
                                    label: formData.guest_list[formData.primary_contact.name].display_name,
                                }
                                : null
                        }
                        onChange={(_event, newValue) =>
                            handlePrimaryChange("name", newValue ? newValue.id : "")
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                                label={"Primary Contact" + (formData.primary_contact?.name ? "" : " is Required")}
                                placeholder="Select a primary contact"
                                required
                                error={!formData.primary_contact?.name}
                                sx={{ width: '40ch' }}
                            />
                        )}
                    />
                </Box>

                {/* Other fields remain as CustomInputField components */}
                <CustomInputField
                    ref={emailRef}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    value={formData.primary_contact?.email ?? ''}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={addressRef}
                    name="address"
                    label="Address"
                    placeholder="Address"
                    value={formData.primary_contact?.address ?? ''}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={phoneRef}
                    name="phone_number"
                    label="Phone Number"
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
                        type="submit"
                        variant="dark"
                        width="75px"
                    />
                </div>
            </Form>
        </div>
    );
};

export default RsvpPrimaryContactPage;
