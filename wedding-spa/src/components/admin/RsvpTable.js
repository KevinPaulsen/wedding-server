// RsvpTable.js
import React from 'react';
import {Container, Table} from 'react-bootstrap';
import useRsvpData from "../../hooks/useRsvpData";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import RsvpTableRow from "./RsvpTable/RsvpTableRow";
import '../../styles/Table.css'

const RsvpTable = () => {
    const {data, loading, error} = useRsvpData();


    return (
        <Container fluid>
            <h2 className="text-center my-4">RSVP List</h2>
            {loading ? (<LoadingSpinner/>) : error ? (<ErrorMessage error={error}/>) : (
                <Table className="custom-table" hover responsive="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>RSVP Code</th>
                        <th>Allowed Guests</th>
                        <th>Guests Attending</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((rsvp, index) => (
                        <RsvpTableRow key={index} rsvp={rsvp}/>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default RsvpTable;
