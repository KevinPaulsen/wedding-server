// RsvpGuests.js
import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import '../../styles/rsvp/RsvpButtons.css';
import {useFlow} from '../../FlowProvider';
import {Button, Col, Container, Row, Table} from 'react-bootstrap';
import {FaTrash} from 'react-icons/fa';
import {RSVP_CONFIRMATION_STEP} from './RsvpConfirmation';
import {RSVP_ADD_GUEST_STEP} from './RsvpAddGuest';
import {RSVP_PRIMARY_CONTACT_STEP} from './RsvpPrimaryContact';
import {useNavigate} from 'react-router-dom';
import {usePutRsvp} from '../../hooks/usePutRsvp';

const RsvpGuests = ({changePage, returnPage}) => {
    const {putRsvp, error, loading} = usePutRsvp();
    const {formData, setEditingGuest, resetFormData, resetStepState, deleteGuest} = useFlow();
    const navigate = useNavigate();

    useEffect(() => {
        if (!formData.guests || formData.guests.length === 0) {
            changePage(RSVP_ADD_GUEST_STEP);
        }
    }, [formData]);

    const handleBack = () => {
        changePage(RSVP_PRIMARY_CONTACT_STEP);
    };

    const handleNext = async () => {
        // TODO: Make at least one guest be required
        // TODO: Make This be in the data transformer
        const putRsvpDto = {
            rsvpCode: formData.rsvpCode, lastName: formData.lastname, rsvpStatus: formData.rsvpStatus, primaryContact: {
                name: formData.preferredContact.name,
                email: formData.preferredContact.email,
                phoneNumber: formData.preferredContact.phone,
            }, rsvpGuestDetails: formData.guests.map((guest) => ({
                name: guest.name, dietaryRestrictions: guest.dietaryRestrictions, other: guest.other,
            })),
        };
        const data = await putRsvp(putRsvpDto);

        if ((!error || error === '') && data) {
            resetFormData();

            if (!returnPage) {
                changePage(RSVP_CONFIRMATION_STEP);
            } else {
                resetStepState();
                navigate(returnPage);
            }
        }
    };

    const handleNewGuest = () => {
        setEditingGuest(null);
        changePage(RSVP_ADD_GUEST_STEP);
    };

    const handleEditGuest = (index) => {
        setEditingGuest({...formData.guests[index], index});
        changePage(RSVP_ADD_GUEST_STEP);
    };

    const handleDeleteGuest = (index) => {
        deleteGuest(index);
    };

    return (<Container style={{maxWidth: '900px'}}>
        {error && <div className="alert alert-danger">{error}</div>}
        <Row className="mb-4">
            {formData.guests.length === 0 ? ('') : (<Table hover className="custom-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>
                        Dietary Restrictions
                    </th>
                    <th>
                        {formData.guests.some((guest) => guest.other && guest.other.trim() !== '') && 'Other'}
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {formData.guests && formData.guests.map((guest, index) => (<tr
                        key={index}
                        onClick={() => handleEditGuest(index)}
                        style={{cursor: 'pointer'}}
                >
                    <td className="align-middle">{guest.name}</td>
                    <td className="align-middle">
                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
                         ? guest.dietaryRestrictions.map((restriction, idx) => (
                                        <span key={idx}> {restriction} <br/> </span>)) : 'None'}
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
            <Button className="rsvp-button dark hover" onClick={handleBack}>
                Back
            </Button>
            <Col className="col-auto">
                {formData.allowedGuestCount > formData.guests.length && <Row className="justify-content-center">
                    <Button className="rsvp-button dark hover width-auto" onClick={handleNewGuest}>
                        Add Guest
                    </Button>
                </Row>}
                <Row className="pt-2 justify-content-center">
                    <body>
                        Remaining Guests: {formData.allowedGuestCount < formData.guests.length ? 0
                                                                                               : formData.allowedGuestCount -
                                                                                                 formData.guests.length}
                    </body>
                </Row>
            </Col>
            <Button className="rsvp-button width-auto dark hover" onClick={handleNext}>
                {loading ? 'Submitting' : 'Submit'}
            </Button>
        </Row>
    </Container>);
};

export default RsvpGuests;
export const RSVP_GUESTS_PAGE = 3;