// RsvpTable.tsx
import React from 'react';
import { Container, Table } from 'react-bootstrap';
import RsvpRow from './RsvpRow';
import "../../../styles/Table.css";
import {Rsvp} from "../../../types/rsvp";

interface RsvpTableProps {
    rsvpData: Rsvp[];
    deleteRsvp: (rsvpCode: string) => Promise<void>;
    error: string | null;
}

const RsvpTable: React.FC<RsvpTableProps> = ({ rsvpData, deleteRsvp, error }) => {
    return (
        <Container fluid>
            {error && <div className="alert alert-danger">{error}</div>}
            <Table hover bordered className="custom-table" responsive="sm">
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
                    <RsvpRow key={index} rsvp={entry} deleteRsvp={deleteRsvp} />
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default RsvpTable;
