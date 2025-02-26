// src/pages/rsvp/RsvpReceptionPage.tsx
import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { useFlow } from '../../context/FlowProvider';
import { useNavigate } from 'react-router-dom';
import { useSubmitRsvp } from '../../hooks/rsvp/useSubmitRsvp';

const RsvpReceptionPage: React.FC = () => {
    const { formData, setFormData, resetFormData } = useFlow();
    const { execute: doSubmit, error, loading } = useSubmitRsvp();
    const navigate = useNavigate();

    const guestList = formData.guest_list || {};
    const reception = formData.reception;

    if (!reception) {
        navigate('/rsvp/confirmation');
        return null;
    }

    const handleCheck = (guestId: string) => {
        const updated = reception.guests_attending.includes(guestId)
            ? reception.guests_attending.filter((id) => id !== guestId)
            : [...reception.guests_attending, guestId];

        setFormData({
            reception: {
                ...reception,
                guests_attending: updated,
            },
        });
    };

    const handleSubmit = async () => {
        // Attempt final submission
        await doSubmit(formData);

        // If no error after finishing, reset local form data & navigate
        if (!error) {
            resetFormData();
            navigate('/rsvp/confirmation');
        }
    };

    return (
        <div className="p-3">
            <h3>Reception Attendance</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {reception.allowed_guests <= 0 ? (
                <p>You have no Reception invitation.</p>
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
                                    checked={reception.guests_attending.includes(id)}
                                    onChange={() => handleCheck(id)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </div>
    );
};

export default RsvpReceptionPage;
