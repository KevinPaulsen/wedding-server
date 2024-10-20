import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {Button, Container, Form, Row} from "react-bootstrap";
import CustomInputField from "../CustomInputField";
import '../../styles/rsvp/RsvpButtons.css'
import {useAddRsvp} from "../../hooks/useAddRsvp";

const AddRsvp = () => {
    const navigate = useNavigate();
    const {addRsvp, loading, error} = useAddRsvp();
    const nameRef = useRef();
    const allowedGuestsRef = useRef();

    const [rsvp, setRsvp] = useState({
                                         "name": "", "lNames": "", "allowedGuestCount": 0,
                                     });

    const handleChange = (e) => {
        setRsvp((prevGuest) => ({
            ...prevGuest, [e.target.name]: e.target.value,
        }));
    };

    const handleAddGuest = async () => {
        const nameValid = nameRef.current.validate();
        const guestCountValid = allowedGuestsRef.current.validate();

        if (nameValid && guestCountValid) {
            try {
                const formattedRsvpData = {
                    rsvpCode: "", primaryContact: {
                        name: rsvp.name.trim(),
                    }, allowedGuestCount: rsvp.allowedGuestCount, guestCount: 0, rsvpGuestDetails: [],
                };

                await addRsvp(formattedRsvpData);
                navigate('/admin/dashboard');
            } catch (error) {
                console.error('Failed to add RSVP:', error);
            }
        }
    };

    return (<Container fluid className="flex-grow-1 align-items-center justify-content-center text-center">
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
                                name="lNames"
                                type="text"
                                value={rsvp.lNames}
                                onChange={handleChange}
                                placeholder="Addional Last Names (comma seperated)"
                                style={{
                                    width: '300px', outline: '2px solid var(--main-dark)',
                                }}
                        />
                        <div style={{height: "28px"}}></div>
                    </Form.Group>

                    <CustomInputField
                            ref={allowedGuestsRef}
                            name="allowedGuestCount"
                            type="number"
                            placeholder="Number of Allowed Guests"
                            value={rsvp.allowedGuestCount}
                            onChange={handleChange}
                            min="0"
                    />

                    <Row className="d-flex justify-content-evenly pt-4 px-2">
                        <Button className='rsvp-button dark width-auto' onClick={handleAddGuest}>
                            {loading ? 'Adding RSVP...' : 'Add RSVP'}
                        </Button>
                    </Row>
                    {error && <p className="text-danger">Failed to add RSVP: {error.message}</p>}
                </Form>
            </Container>);
};

export default AddRsvp;
