// src/pages/rsvp/RsvpCeremonyPage.tsx
import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';

const RsvpCeremonyPage: React.FC = () => {
    const { formData, setFormData } = useFlow();
    const navigate = useNavigate();

    const guestList = formData.guest_list || {};
    const ceremony = formData.ceremony;

    if (!ceremony) {
        navigate('/rsvp/reception');
        return null;
    }

    const handleCheck = (guestId: string) => {
        const updated = ceremony.guests_attending.includes(guestId)
            ? ceremony.guests_attending.filter((id) => id !== guestId)
            : [...ceremony.guests_attending, guestId];

        setFormData({
            ceremony: {
                ...ceremony,
                guests_attending: updated,
            },
        });
    };

    const handleNext = () => {
        navigate('/rsvp/reception');
    };

    return (
        <div className="p-3">
            <h3>Ceremony Attendance</h3>
            {ceremony.allowed_guests <= 0 ? (
                <p>You have no Ceremony invitation.</p>
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
                                    checked={ceremony.guests_attending.includes(id)}
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

export default RsvpCeremonyPage;
