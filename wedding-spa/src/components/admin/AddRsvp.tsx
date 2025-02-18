// AddRsvp.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Row } from 'react-bootstrap';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import CustomInputField, { CustomInputFieldRef } from '../shared/CustomInputField';
import { useAddRsvp } from '../../hooks/rsvp/useAddRsvp';

interface RsvpData {
    name: string;
    lastnames: string;
    allowedGuestCount: number;
}

const AddRsvp: React.FC = () => {
    const navigate = useNavigate();
    // The new approach
    const { execute: addRsvp, loading, error } = useAddRsvp();

    // Refs for validating input fields
    const nameRef = useRef<CustomInputFieldRef>(null);
    const allowedGuestsRef = useRef<CustomInputFieldRef>(null);

    const [rsvp, setRsvp] = useState<RsvpData>({
        name: '',
        lastnames: '',
        allowedGuestCount: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRsvp((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddGuest = async () => {
        const nameValid = nameRef.current?.validate() ?? false;
        const guestCountValid = allowedGuestsRef.current?.validate() ?? false;

        if (nameValid && guestCountValid) {
            const formattedRsvpData = {
                rsvpCode: '',
                primaryContact: {
                    name: rsvp.name.trim(),
                },
                lastnames: rsvp.lastnames.trim().split(','),
                allowedGuestCount: rsvp.allowedGuestCount,
            };

            await addRsvp(formattedRsvpData);
            if (!error) {
                // If there's no error from the API call, navigate away
                navigate('/admin/dashboard');
            }
        }
    };

    return (
        <Container fluid className="flex-grow-1 align-items-center justify-content-center text-center">
            <Form>
                <CustomInputField
                    ref={nameRef}
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={rsvp.name}
                    onChange={handleChange}
                />
                <Form.Group controlId="lNames" className="d-flex flex-column align-items-center">
                    <Form.Control
                        name="lastnames"
                        type="text"
                        value={rsvp.lastnames}
                        onChange={handleChange}
                        placeholder="Additional Last Names (comma separated)"
                        style={{ width: '300px', outline: '2px solid var(--main-dark)' }}
                    />
                    <div style={{ height: '28px' }}></div>
                </Form.Group>
                <CustomInputField
                    ref={allowedGuestsRef}
                    name="allowedGuestCount"
                    type="number"
                    placeholder="Number of Allowed Guests"
                    value={rsvp.allowedGuestCount.toString()}
                    onChange={handleChange}
                    min="0"
                />
                <Row className="d-flex justify-content-evenly pt-4 px-2">
                    <Button className="rsvp-button dark width-auto" onClick={handleAddGuest}>
                        {loading ? 'Adding RSVP...' : 'Add RSVP'}
                    </Button>
                </Row>
                {/* If the API returned an error, display it */}
                {error && <p className="text-danger">Failed to add RSVP: {error}</p>}
            </Form>
        </Container>
    );
};

export default AddRsvp;
