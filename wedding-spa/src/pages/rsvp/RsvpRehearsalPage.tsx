// src/pages/rsvp/RsvpRehearsalPage.tsx
import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';

const RsvpRehearsalPage: React.FC = () => {
    const { formData, setFormData } = useFlow();
    const navigate = useNavigate();

    const guestList = formData.guest_list || {};
    const rehearsal = formData.rehearsal;

    if (!rehearsal) {
        navigate('/rsvp/ceremony');
        return null;
    }

    const handleCheck = (guestId: string) => {
        const updated = rehearsal.guests_attending.includes(guestId)
            ? rehearsal.guests_attending.filter((id) => id !== guestId)
            : [...rehearsal.guests_attending, guestId];

        setFormData({
            rehearsal: {
                ...rehearsal,
                guests_attending: updated,
            },
        });
    };

    const handleNext = () => {
        navigate('/rsvp/ceremony');
    };

    return (
        <div className="p-3">
            <h3>Rehearsal Attendance</h3>
            {rehearsal.allowed_guests <= 0 ? (
                <p>You have no Rehearsal invitation.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Guest</th>
                        <th>Attending?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(guestList).map(([id, guest]) => (
                        <tr key={id}>
                            <td>{guest.display_name}</td>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={rehearsal.guests_attending.includes(id)}
                                    onChange={() => handleCheck(id)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
            <Button onClick={handleNext}>Next</Button>
        </div>
    );
};

export default RsvpRehearsalPage;
