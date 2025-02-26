// src/pages/rsvp/RsvpRocePage.tsx
import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';

const RsvpRocePage: React.FC = () => {
    const { formData, setFormData } = useFlow();
    const navigate = useNavigate();

    const guestList = formData.guest_list || {};
    const roce = formData.roce;

    if (!roce) {
        // If for some reason roce is null, skip
        navigate('/rsvp/rehearsal');
        return null;
    }

    const handleCheck = (guestId: string) => {
        const alreadyAttending = roce.guests_attending || [];
        const updated = alreadyAttending.includes(guestId)
            ? alreadyAttending.filter((id) => id !== guestId)
            : [...alreadyAttending, guestId];

        setFormData({
            roce: {
                ...roce,
                guests_attending: updated,
            },
        });
    };

    const handleNext = () => {
        navigate('/rsvp/rehearsal');
    };

    return (
        <div className="p-3">
            <h3>Roce Attendance</h3>
            {roce.allowed_guests <= 0 ? (
                <p>You have no Roce invitation.</p>
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
                                    checked={roce.guests_attending?.includes(id) || false}
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

export default RsvpRocePage;
