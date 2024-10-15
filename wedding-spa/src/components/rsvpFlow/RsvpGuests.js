import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Container, Row, Table} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import {RSVP_CONFIRMATION_STEP} from "./RsvpConfirmation";
import {RSVP_ADD_GUEST_STEP} from "./RsvpAddGuest";
import {RSVP_PRIMARY_CONTACT_STEP} from "./RsvpPrimaryContact";

const RsvpGuests = ({changePage}) => {
    const {formData, setFormData, setEditingGuest} = useFlow();

    const handleBack = () => {
        changePage(RSVP_PRIMARY_CONTACT_STEP)
    }

    const handleNext = () => {
        // TODO: Make at least one guest be required
        changePage(RSVP_CONFIRMATION_STEP)
    };

    const handleNewGuest = () => {
        setEditingGuest(null);
        changePage(RSVP_ADD_GUEST_STEP)
    };

    const handleEditGuest = (index) => {
        setEditingGuest({...formData.guests[index], index});
        changePage(RSVP_ADD_GUEST_STEP)
    };

    const handleDeleteGuest = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            guests: prevData.guests.filter((_, i) => i !== index),
        }));
    };

    return (
        <Container style={{maxWidth: "900px"}}>
            <Row className="mb-4">
                {formData.guests.length === 0 ? (
                    ""
                ) : (
                    <Table hover className="custom-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>
                                {formData.guests.some(
                                    (guest) => guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
                                ) && "Dietary Restrictions"}
                            </th>
                            <th>
                                {formData.guests.some(
                                    (guest) => guest.other && guest.other.trim() !== ""
                                ) && "Other"}
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {formData.guests &&
                            formData.guests.map((guest, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleEditGuest(index)}
                                    style={{cursor: "pointer"}}
                                >
                                    <td className="align-middle">
                                        {guest.fName + " " + guest.lName}
                                    </td>
                                    <td className="align-middle">
                                        {guest.dietaryRestrictions.map((restriction, idx) => (
                                            <span key={idx}>
                                                {restriction}
                                                <br/>
                                            </span>
                                        ))}
                                    </td>
                                    <td className="align-middle">{guest.other}</td>
                                    <td className="align-middle">
                                        <Button
                                            variant="link"
                                            className="p-0"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents row click from being triggered
                                                handleDeleteGuest(index);
                                            }}
                                        >
                                            <FaTrash size={20} color="var(--main-dark)"/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Row>
            <Row className="d-flex justify-content-evenly my-5 px-2">
                <Button className="rsvp-button dark" onClick={handleBack}>
                    Back
                </Button>
                <Button className="rsvp-button dark long" onClick={handleNewGuest}>
                    Add Guest
                </Button>
                <Button className="rsvp-button dark" onClick={handleNext}>
                    Next
                </Button>
            </Row>
        </Container>
    );
};

export default RsvpGuests;
export const RSVP_GUESTS_PAGE = 3;
