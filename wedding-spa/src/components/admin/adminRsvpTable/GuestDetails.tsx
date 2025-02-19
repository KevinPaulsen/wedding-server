// GuestDetails.js
import React from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import '../../../styles/DarkTable.css';

interface GuestDetail {
    name: string;
    foodOption?: string;
    dietaryRestrictions: string[];
    other?: string;
}

interface PrimaryContact {
    name: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
}

interface RsvpEntry {
    primaryContact: PrimaryContact;
    lastnames: string[];
    rsvpGuestDetails: GuestDetail[];
}

interface GuestDetailsProps {
    rsvpEntry: RsvpEntry;
}

const GuestDetails: React.FC<GuestDetailsProps> = ({ rsvpEntry }) => {
    const { primaryContact, lastnames, rsvpGuestDetails } = rsvpEntry;

    const hasFoodOption = rsvpGuestDetails.some(detail => detail.foodOption);
    const hasOther = rsvpGuestDetails.some(detail => detail.other);

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
                            <td>{primaryContact.name}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{primaryContact.phoneNumber || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{primaryContact.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{primaryContact.address || 'N/A'}</td>
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
                        {lastnames.map((lastname, index) => (
                            <tr key={index}>
                                <td>{lastname}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
                {rsvpGuestDetails && rsvpGuestDetails.length > 0 && (
                    <Col lg={6} xs={12}>
                        <Table className="dark-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                {hasFoodOption && <th style={{ whiteSpace: "nowrap" }}>Food Option</th>}
                                <th style={{ whiteSpace: "nowrap" }}>Dietary Restrictions</th>
                                {hasOther && <th>Other</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {rsvpGuestDetails.map((guest, index) => (
                                <tr key={index}>
                                    <td>{guest.name}</td>
                                    {hasFoodOption && <td>{guest.foodOption || 'None'}</td>}
                                    <td>
                                        {guest.dietaryRestrictions.length > 0
                                            ? guest.dietaryRestrictions.join(', ')
                                            : 'None'}
                                    </td>
                                    {hasOther && <td>{guest.other || 'N/A'}</td>}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default GuestDetails;
