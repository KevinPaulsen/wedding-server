// components/shared/rsvpFlow/RsvpVerificationPage.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Box} from '@mui/material';
import CustomInputField from '../CustomInputField';
import {useFlow} from '../../../context/FlowProvider';
import {useLookupRsvp} from '../../../hooks/rsvp/useLookupRsvp';
import {Rsvp} from "../../../types/rsvp";
import CustomButton from "../CustomButton";

interface RsvpVerificationPageProps {
    nextPage: (rsvp: Rsvp) => void;
    previousPage: (rsvp: Rsvp) => void;
    requireAnswers: boolean;
    returnPage?: string | null;
}

const RsvpVerificationPage: React.FC<RsvpVerificationPageProps> = ({ nextPage, requireAnswers }) => {
    const { formData, setFormData } = useFlow();
    const firstNameRef = useRef<any>(null);
    const codeRef = useRef<any>(null);

    const { data, error, loading, execute: doLookup } = useLookupRsvp();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = async () => {
        const validFirst = firstNameRef.current.validate();
        const validCode = codeRef.current.validate();
        if (!validFirst || !validCode) return;
        await doLookup({ first_name: form.firstName, last_name: form.lastName });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleNext();
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFormData(data[0]);
            nextPage(formData);
        }
    }, [data, setFormData, nextPage, formData]);

    return (
        <Box sx={{ p: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <CustomInputField
                    ref={firstNameRef}
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="Enter your First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={codeRef}
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Enter your Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomButton
                    type="submit"
                    text={loading ? 'Validating...' : 'Next'}
                    variant="dark"
                    width="auto"
                    disabled={loading}
                />
            </Box>
        </Box>
    );
};

export default RsvpVerificationPage;
