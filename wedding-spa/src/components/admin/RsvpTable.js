// RsvpTable.js
import React from 'react';
import {Container, Table} from 'react-bootstrap';
import useRsvpData from "../../hooks/useRsvpData";
import LoadingSpinner from "./RsvpTable/LoadingSpinner";
import ErrorMessage from "./RsvpTable/ErrorMessage";
import RsvpTableRow from "./RsvpTable/RsvpTableRow";
import '../../styles/rsvp/RsvpTable.css'

const RsvpTable = () => {
    const { data, loading, error } = useRsvpData();


    return (
        <Container fluid>
            <h2 className="text-center my-4">RSVP List</h2>
            {loading ? ( <LoadingSpinner /> ) : error ? ( <ErrorMessage error={error} /> ) : (
                <Table striped bordered hover responsive="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>RSVP Code</th>
                        <th>Allowed Guests</th>
                        <th>Guests Attending</th>
                    </tr>
                    </thead>
                    <tbody className="no-hover">
                    {data.map((item, index) => (
                        <RsvpTableRow key={index} item={item} />
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default RsvpTable;
