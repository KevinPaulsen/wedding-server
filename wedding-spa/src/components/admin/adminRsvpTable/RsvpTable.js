// RsvpTable.js
import React from 'react';
import {Container, Table} from 'react-bootstrap';
import RsvpRow from './RsvpRow';
import "../../../styles/Table.css"

const RsvpTable = ({ rsvpData, deleteRsvp, error }) => {
    return (
            <Container fluid>
                {error && <div className="alert alert-danger">{error}</div>}
                <Table
                        hover
                        bordered={true}
                        className="custom-table"
                        responsive="sm"
                >
                    <thead>
                    <tr>
                        <th>RSVP Code</th>
                        <th>Primary Contact</th>
                        <th className="d-none d-md-table-cell">Allowed Guests</th>
                        <th>RSVP Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rsvpData.map((entry, index) => (
                            <RsvpRow key={index} rsvpEntry={entry} deleteRsvp={deleteRsvp} />
                    ))}
                    </tbody>
                </Table>
            </Container>
    );
};

export default RsvpTable;
