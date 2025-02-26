// src/pages/rsvp/RsvpVerificationPage.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import CustomInputField from '../../components/shared/CustomInputField';
import { useFlow } from '../../context/FlowProvider';
import { useLookupRsvp } from '../../hooks/rsvp/useLookupRsvp';

const RsvpVerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const { setFormData } = useFlow();
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

        // We call lookup with first_name = form.firstName, last_name = form.rsvpCode
        await doLookup({ first_name: form.firstName, last_name: form.lastName });
    };

    // If data changes (meaning the request succeeded), pick the first RSVP.
    if (data && data.length > 0) {
        // In a real scenario you might handle multiple. Here we assume only one:
        setFormData(data[0]); // store the found Rsvp in FlowContext
        navigate('/rsvp/primary');
    }

    return (
        <div className="p-3">
            <h3>RSVP Verification</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <Form>
                <CustomInputField
                    ref={firstNameRef}
                    name="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    value={form.firstName}
                    onChange={handleChange}
                />

                <CustomInputField
                    ref={codeRef}
                    name="lastName"
                    type="text"
                    placeholder="Enter RSVP Code"
                    value={form.lastName}
                    onChange={handleChange}
                />

                <Button onClick={handleNext} disabled={loading}>
                    {loading ? 'Validating...' : 'Next'}
                </Button>
            </Form>
        </div>
    );
};

export default RsvpVerificationPage;
