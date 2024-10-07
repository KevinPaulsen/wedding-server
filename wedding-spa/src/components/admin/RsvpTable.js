import React, {useEffect, useState} from 'react';
import {Table, Accordion, Card, Spinner, Col, Row} from 'react-bootstrap';


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
        <div>
            {/* Centered Title */}
            <h2 className="text-center my-4">RSVP List</h2>

            <div className="">
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <div className="text-danger text-center">Error: {error}</div>
                ) : (
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
                                                            {/* Container with a Grid Layout */}
                                                            <Row>
                                                                {/* Primary Contact Section */}
                                                                <Col xs={12} md={4} className="text-center mb-4">
                                                                    <h5>Primary Contact Information</h5>
                                                                    <div className="text-start">
                                                                        <div>{item.primaryContact.name}</div>
                                                                        <div>{item.primaryContact.email}</div>
                                                                        <div>{item.primaryContact.phoneNumber}</div>
                                                                        <div>{item.primaryContact.address}</div>
                                                                    </div>
                                                                </Col>

                                                                {/* Guests Section */}
                                                                <Col xs={12} md={8}>
                                                                    <h5 className="text-center">Guests Details</h5>
                                                                    <Table size="sm">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>Guest Name</th>
                                                                            <th>Food Option</th>
                                                                            <th>Dietary Restrictions</th>
                                                                            <th>Other</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {item.rsvpGuestDetails.map((guest, i) => (
                                                                            <tr key={i}>
                                                                                <td>{guest.name}</td>
                                                                                <td>{guest.foodOption}</td>
                                                                                <td>{guest.dietaryRestrictions || 'None'}</td>
                                                                                <td>{guest.other || 'None'}</td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </Table>
                                                                </Col>
                                                            </Row>
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
                )}
            </div>
        </div>
    );
};

export default RsvpTable;
