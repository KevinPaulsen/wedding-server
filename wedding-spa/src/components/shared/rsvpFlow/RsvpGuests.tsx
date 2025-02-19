// RsvpGuests.tsx
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/Transitions.css';
import '../../../styles/rsvp/RsvpButtons.css';
import { useFlow } from '../../../context/FlowProvider';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { RSVP_CONFIRMATION_STEP } from './RsvpConfirmation';
import { RSVP_ADD_GUEST_STEP } from './RsvpAddGuest';
import { RSVP_PRIMARY_CONTACT_STEP } from './RsvpPrimaryContact';
import { useNavigate } from 'react-router-dom';
import { usePutRsvp } from '../../../hooks/rsvp/usePutRsvp';

interface RsvpGuestsProps {
    changePage: (step: number) => void;
    returnPage?: string;
}

const RsvpGuests: React.FC<RsvpGuestsProps> = ({ changePage, returnPage }) => {
    // usePutRsvp returns { execute, error, loading, data }
    const { execute: putRsvp, error, loading } = usePutRsvp();

    // Get Flow context values (formData is typed as Rsvp from your types/rsvp.ts)
    const { formData, setEditingGuest, resetFormData, resetStepState, deleteGuest } = useFlow();
    const navigate = useNavigate();

    useEffect(() => {
        // If there are no guests, force the user to add one.
        if (!formData.rsvpGuestDetails || formData.rsvpGuestDetails.length === 0) {
            changePage(RSVP_ADD_GUEST_STEP);
        }
    }, [formData, changePage]);

    const handleBack = () => {
        changePage(RSVP_PRIMARY_CONTACT_STEP);
    };

    const handleNext = async () => {
        // Build the update object.
        // Note: formData.lastnames is an array; we join it into a string if the API expects a single string.
        const putRsvpDto = {
            rsvpCode: formData.rsvpCode,
            lastName: formData.lastnames.join(','), // joining the array into a single string
            rsvpStatus: formData.rsvpStatus,
            primaryContact: {
                name: formData.primaryContact.name,
                email: formData.primaryContact.email,
                phoneNumber: formData.primaryContact.phoneNumber, // mapping "phone" to "phoneNumber"
            },
            rsvpGuestDetails: formData.rsvpGuestDetails.map(guest => ({
                name: guest.name,
                dietaryRestrictions: guest.dietaryRestrictions,
                other: guest.other,
            })),
        };

        await putRsvp(putRsvpDto);

        // If there is no error and updated data was returned, proceed.
        if (!error && !loading) {
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

    const handleEditGuest = (index: number) => {
        // Set the editing guest along with its index for editing.
        setEditingGuest({ ...formData.rsvpGuestDetails[index], index });
        changePage(RSVP_ADD_GUEST_STEP);
    };

    const handleDeleteGuest = (index: number) => {
        // Directly remove the guest from the local FlowProvider state.
        deleteGuest(index);
    };

    return (
        <Container style={{ maxWidth: '900px' }}>
            {error && <div className="alert alert-danger">{error}</div>}
            <Row className="mb-4">
                {formData.rsvpGuestDetails.length === 0 ? (
                    ''
                ) : (
                    <Table hover className="custom-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Dietary Restrictions</th>
                            <th>
                                {formData.rsvpGuestDetails.some(
                                    guest => guest.other && guest.other.trim() !== ''
                                ) && 'Other'}
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {formData.rsvpGuestDetails.map((guest, index) => (
                            <tr
                                key={index}
                                onClick={() => handleEditGuest(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="align-middle">{guest.name}</td>
                                <td className="align-middle">
                                    {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
                                        ? guest.dietaryRestrictions.map((restriction, idx) => (
                                            <span key={idx}>
                            {restriction}
                                                <br />
                          </span>
                                        ))
                                        : 'None'}
                                </td>
                                <td className="align-middle">{guest.other}</td>
                                <td className="align-middle">
                                    <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteGuest(index);
                                        }}
                                    >
                                        <FaTrash size={20} color="var(--main-dark)" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Row>
            <Row className="d-flex justify-content-evenly my-5 px-2">
                <Button className="rsvp-button dark hover" onClick={handleBack}>
                    Back
                </Button>
                <Col className="col-auto">
                    {formData.allowedGuestCount > formData.rsvpGuestDetails.length && (
                        <Row className="justify-content-center">
                            <Button className="rsvp-button dark hover width-auto" onClick={handleNewGuest}>
                                Add Guest
                            </Button>
                        </Row>
                    )}
                    <Row className="pt-2 justify-content-center">
                        <div>
                            Remaining Guests:{' '}
                            {formData.allowedGuestCount < formData.rsvpGuestDetails.length
                                ? 0
                                : formData.allowedGuestCount - formData.rsvpGuestDetails.length}
                        </div>
                    </Row>
                </Col>
                <Button className="rsvp-button width-auto dark hover" onClick={handleNext}>
                    {loading ? 'Submitting' : 'Submit'}
                </Button>
            </Row>
        </Container>
    );
};

export default RsvpGuests;
export const RSVP_GUESTS_PAGE = 3;
