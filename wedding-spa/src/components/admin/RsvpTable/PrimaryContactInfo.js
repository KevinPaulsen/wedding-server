import React from 'react';
import PropTypes from 'prop-types';
import {Col, Container, Row} from "react-bootstrap";

const PrimaryContactInfo = ({primaryContact, lastNames}) => (
    <Container>
        <Row>
            <h5>Primary Contact Information</h5>
        </Row>
        <Row className="justify-content-center">
            <Col xs={"auto"}>
                <div>{primaryContact.name}</div>
                <div>{primaryContact.email}</div>
                <div>{primaryContact.phoneNumber}</div>
                <div>{primaryContact.address}</div>
            </Col>
            <Col xs={"auto"}>
                {lastNames.map(lastName => <div>{lastName}</div>)}
            </Col>
        </Row>
    </Container>)
;

PrimaryContactInfo.propTypes = {
    lastNames: PropTypes.array.isRequired,
    primaryContact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        address: PropTypes.string,
    }).isRequired,
};

export default PrimaryContactInfo;
