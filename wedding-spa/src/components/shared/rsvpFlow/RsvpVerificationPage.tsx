import React, {useEffect, useRef, useState} from 'react';
import {Form} from 'react-bootstrap';
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

const RsvpVerificationPage: React.FC<RsvpVerificationPageProps> = ({
                                                                       nextPage,
                                                                       requireAnswers,
                                                                   }) => {
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

        if (!validFirst || !validCode) {
            return;
        }

        await doLookup({ first_name: form.firstName, last_name: form.lastName });
    };

    // New onSubmit handler that triggers handleNext when Enter is pressed
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleNext();
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFormData(data[0]);
            nextPage(formData);
        }
    }, [data, setFormData, nextPage]);

    return (
        <div className="p-3">
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <CustomInputField
                    ref={firstNameRef}
                    name="firstName"
                    type="text"
                    placeholder="Enter your First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required={requireAnswers}
                />
                <CustomInputField
                    ref={codeRef}
                    name="lastName"
                    type="text"
                    placeholder="Enter your Lastname"
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
            </Form>
        </div>
    );
};

export default RsvpVerificationPage;
