// src/pages/rsvp/RsvpGuestDetailsPage.tsx
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';
// Example: you might create a small form or modal to edit details. Omitted for brevity.

const RsvpGuestDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData } = useFlow();
    const guests = formData.guest_list || {};

    // Example: handle editing a single guest
    const handleEditGuest = (id: string) => {
        // Optionally navigate to an "EditGuest" page or open a modal
        // For now, just console log
        console.log('Editing guest:', id);
    };

    // Example: handle next
    const handleNext = () => {
        navigate('/rsvp/roce');
    };

    return (
        <div className="p-3">
            <h3>Guest Details</h3>

            {Object.keys(guests).length === 0 ? (
                <div>No guests found.</div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Display Name</th>
                        <th>Dietary Restrictions</th>
                        <th>Other</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(guests).map(([id, guest]) => (
                        <tr key={id}>
                            <td>{guest.display_name}</td>
                            <td>
                                {guest.dietary_restrictions && guest.dietary_restrictions.length > 0
                                    ? guest.dietary_restrictions.join(', ')
                                    : 'None'}
                            </td>
                            <td>{guest.other || ''}</td>
                            <td>
                                <Button size="sm" onClick={() => handleEditGuest(id)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            {/* Example: Add new guest button if desired */}
            <div className="mt-3">
                <Button variant="primary" onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default RsvpGuestDetailsPage;
