import React, {useEffect, useState} from 'react';
import { Table, Accordion, Card, Button } from 'react-bootstrap';

const url = "https://api.KevinLovesOlivia.com"

const RsvpTable = () => {
    // State to keep track of which row is expanded
    const [expandedRows, setExpandedRows] = useState({});

    // State to store fetched data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Toggle row expanded state
    const toggleRowExpansion = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Fetch data from API endpoint
    useEffect(() => {
        const fetchRsvpData = async () => {
            try {
                const response = await fetch(url + '/rsvp/rsvps', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRsvpData();
    }, []);

    return (
        <div className="table-responsive">
            <Table striped bordered hover responsive="sm">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>RSVP Code</th>
                    <th>Allowed Guests</th>
                    <th>Guests Attending</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Main Row */}
                        <tr onClick={() => toggleRowExpansion(index)}>
                            <td>{item.primaryContact.name}</td>
                            <td>{item.rsvpCode}</td>
                            <td>{item.allowedGuestCount}</td>
                            <td>{item.guestCount}</td>
                        </tr>
                        {/* Expansion Section */}
                        {expandedRows[index] && (
                            <tr>
                                <td colSpan="4">
                                    <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <div>
                                                        <strong>Email:</strong> {item.primaryContact.email} <br />
                                                        <strong>Phone Number:</strong> {item.primaryContact.phoneNumber} <br />
                                                        <strong>Address:</strong> {item.primaryContact.address}
                                                    </div>
                                                    <hr />
                                                    <h6>Guests:</h6>
                                                    {item.rsvpGuestDetails.map((guest, i) => (
                                                        <div key={i}>
                                                            <strong>Guest Name:</strong> {guest.name} <br />
                                                            <strong>Food Option:</strong> {guest.foodOption} <br />
                                                            <strong>Dietary Restrictions:</strong> {guest.dietaryRestrictions || 'None'} <br />
                                                            <strong>Other:</strong> {guest.other || 'None'}
                                                            {i < item.rsvpGuestDetails.length - 1 && <hr />}
                                                        </div>
                                                    ))}
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default RsvpTable;
