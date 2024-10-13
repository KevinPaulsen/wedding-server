// AdminDashboard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RsvpTable from "./RsvpTable";
import {Container} from "react-bootstrap";

function RsvpList() {
    return (
        <Container fluid>
            <RsvpTable />
        </Container>
    );
}

export default RsvpList;
