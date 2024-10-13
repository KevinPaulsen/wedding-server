import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {Button, Container, Form, Row} from "react-bootstrap";
import CustomInputField from "../../components/rsvp/CustomInputField";
import '../../styles/rsvp/RsvpButtons.css'
import {useAddRsvp} from "../../hooks/useAddRsvp";

const AddRsvp = () => {
    const navigate = useNavigate();
    const rsvpCodeRef = useRef();
    const { addRsvp, loading, error } = useAddRsvp();
    const fNameRef = useRef();
    const lNamesRef = useRef();
    const allowedGuestsRef = useRef();

    const [rsvp, setRsvp] = useState({
        "rsvpCode": "",
        "fName": "",
        "lNames": "",
        "allowedGuestCount": 0,
    });

    const handleChange = (e) => {
        setRsvp((prevGuest) => ({
            ...prevGuest,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAddGuest = async () => {
        const rsvpCodeValid = rsvpCodeRef.current.validate();
        const fNameValid = fNameRef.current.validate();
        const lNamesValid = lNamesRef.current.validate();
        const guestCountValid = allowedGuestsRef.current.validate();

        if (rsvpCodeValid && fNameValid && lNamesValid && guestCountValid) {
            try {
                const formattedRsvpData = {
                    rsvpCode: rsvp.rsvpCode,
                    primaryContact: {
                        fName: rsvp.fName,
                    },
                    lastNames: rsvp.lNames.split(',').map((name) => name.trim()),
                    allowedGuestCount: rsvp.allowedGuestCount,
                    guestCount: 0,
                    rsvpGuestDetails: [],
                };

                await addRsvp(formattedRsvpData);
                navigate('/admin/dashboard');
            } catch (error) {
                console.error('Failed to add RSVP:', error);
            }
        }
    };

    return (
        <Container fluid className="flex-grow-1 align-items-center justify-content-center text-center">
            <Form>
                <CustomInputField
                    ref={rsvpCodeRef}
                    name="rsvpCode"
                    type="text"
                    placeholder="RSVP Code"
                    value={rsvp.rsvpCode}
                    onChange={handleChange}
                />
                <CustomInputField
                    ref={fNameRef}
                    name="fName"
                    type="text"
                    placeholder="First Name"
                    value={rsvp.fName}
                    onChange={handleChange}
                />
                <CustomInputField
                    ref={lNamesRef}
                    name="lNames"
                    type="text"
                    placeholder="Last Names (comma seperated)"
                    value={rsvp.lNames}
                    onChange={handleChange}
                />

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
        </Container>
    );
};

export default AddRsvp;
