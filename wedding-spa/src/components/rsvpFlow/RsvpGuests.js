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
import {useNavigate} from "react-router-dom";
import {usePutRsvp} from "../../hooks/usePutRsvp";

const RsvpGuests = ({changePage, returnPage}) => {
    const {putRsvp, error, loading} = usePutRsvp();
    const {formData, setFormData, setEditingGuest, resetFormData, resetStepState} = useFlow();
    const navigate = useNavigate();

    const handleBack = () => {
        changePage(RSVP_PRIMARY_CONTACT_STEP)
    }

    const handleNext = async () => {
        // TODO: Make at least one guest be required
        const putRsvpDto = {
            rsvpCode: formData.rsvpCode,
            lastName: formData.lastName,
            primaryContact: {
                name: formData.prefName,
                email: formData.prefEmail,
                phone: formData.prefPhone,
                address: "",
            },
            rsvpGuestDetails: formData.guests.map((guest) => ({
                name: guest.fName + " " + guest.lName,
                foodOption: "",
                dietaryRestrictions: guest.dietaryRestrictions,
                other: guest.other,
            })),
        };
        await putRsvp(putRsvpDto);

        if (error === '') {
            resetFormData();

            if (returnPage === null) {
                changePage(RSVP_CONFIRMATION_STEP);
            } else {
                resetStepState();
                navigate(returnPage);
            }
        }
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
            ...prevData, guests: prevData.guests.filter((_, i) => i !== index),
        }));
    };

    return (<Container style={{maxWidth: "900px"}}>
                {error && <div className="alert alert-danger">{error}</div>}
                <Row className="mb-4">
                    {formData.guests.length === 0 ? ("") : (<Table hover className="custom-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>
                                        {formData.guests.some((guest) => guest.dietaryRestrictions &&
                                         guest.dietaryRestrictions.length > 0) && "Dietary Restrictions"}
                                    </th>
                                    <th>
                                        {formData.guests.some((guest) => guest.other && guest.other.trim() !== "") &&
                                         "Other"}
                                    </th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {formData.guests && formData.guests.map((guest, index) => (<tr
                                                key={index}
                                                onClick={() => handleEditGuest(index)}
                                                style={{cursor: "pointer"}}
                                        >
                                            <td className="align-middle">
                                                {guest.fName + " " + guest.lName}
                                            </td>
                                            <td className="align-middle">
                                                {guest.dietaryRestrictions.map((restriction, idx) => (<span key={idx}>
                                                {restriction}
                                                            <br/>
                                            </span>))}
                                            </td>
                                            <td className="align-middle">{guest.other}</td>
                                            <td className="align-middle">
                                                <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevents row click from being
                                                            // triggered
                                                            handleDeleteGuest(index);
                                                        }}
                                                >
                                                    <FaTrash size={20} color="var(--main-dark)"/>
                                                </Button>
                                            </td>
                                        </tr>))}
                                </tbody>
                            </Table>)}
                </Row>
                <Row className="d-flex justify-content-evenly my-5 px-2">
                    <Button className="rsvp-button dark" onClick={handleBack}>
                        Back
                    </Button>
                    <Button className="rsvp-button dark long" onClick={handleNewGuest}>
                        Add Guest
                    </Button>
                    <Button className="rsvp-button width-auto dark" onClick={handleNext}>
                        {loading ? "Submitting" : "Submit"}
                    </Button>
                </Row>
            </Container>);
};

export default RsvpGuests;
export const RSVP_GUESTS_PAGE = 3;
