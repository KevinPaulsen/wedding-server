// src/pages/rsvp/RsvpPrimaryContactPage.tsx
import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import CustomInputField from '../../components/shared/CustomInputField';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';

const RsvpPrimaryContactPage: React.FC = () => {
    const { formData, setFormData } = useFlow();
    const navigate = useNavigate();

    const nameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const addressRef = useRef<any>(null);
    const phoneRef = useRef<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            primary_contact: {
                ...formData.primary_contact,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleNext = () => {
        const validName = nameRef.current.validate();
        const validEmail = emailRef.current.validate();
        const validAddress = addressRef.current.validate();
        const validPhone = phoneRef.current.validate();

        if (validName && validEmail && validAddress && validPhone) {
            navigate('/rsvp/guests');
        }
    };

    return (
        <div className="p-3">
            <h3>Primary Contact Information</h3>
            <Form>
                <CustomInputField
                    ref={nameRef}
                    name="name"
                    placeholder="Full Name"
                    value={formData.primary_contact?.name ?? ''}
                    onChange={handleChange}
                />
                <CustomInputField
                    ref={emailRef}
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.primary_contact?.email ?? ''}
                    onChange={handleChange}
                />
                <CustomInputField
                    ref={addressRef}
                    name="address"
                    placeholder="Address"
                    value={formData.primary_contact?.address ?? ''}
                    onChange={handleChange}
                />
                <CustomInputField
                    ref={phoneRef}
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.primary_contact?.phone_number ?? ''}
                    onChange={handleChange}
                />

                <Button onClick={handleNext}>Next</Button>
            </Form>
        </div>
    );
};

export default RsvpPrimaryContactPage;
