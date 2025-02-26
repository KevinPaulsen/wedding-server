// GuestDetails.tsx
import React from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import '../../../styles/DarkTable.css';
import {Rsvp} from "../../../types/rsvp";

const GuestDetails: React.FC<Rsvp> = ({ primary_contact, guest_list }) => {
    // const hasFoodOption = rsvpGuestDetails.some(detail => detail.foodOption);
    // const hasOther = rsvpGuestDetails.some(detail => detail.other);

    return (
        <Card
            body
            style={{
                backgroundColor: 'var(--main-dark)',
                color: 'var(--main-light)',
            }}
        >
            <Row className="justify-content-evenly">
                <Col lg={3} xs="auto">
                    <Table bordered className="dark-table">
                        <thead>
                        <tr>
                            <th className="text-center" colSpan={2}>Primary Contact</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{primary_contact.name}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{primary_contact.phone_number || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{primary_contact.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{primary_contact.address || 'N/A'}</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col lg="auto" xs="auto">
                    <Table className="dark-table">
                        <thead>
                        <tr>
                            <th className="text-center">Last Names</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Card>
    );
};

export default GuestDetails;
