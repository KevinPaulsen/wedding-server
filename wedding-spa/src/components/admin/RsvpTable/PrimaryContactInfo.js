import React from 'react';
import PropTypes from 'prop-types';
import {Col, Container, Row} from "react-bootstrap";

const PrimaryContactInfo = ({primaryContact, lastnames}) => (
    <Container>
        <Row>
            <h5>Primary Contact Information</h5>
        </Row>
        <Row className="justify-content-center">
            {primaryContact &&
            <Col xs={"auto"}>
                <div>{primaryContact.name}</div>
                <div>{primaryContact.email}</div>
                <div>{primaryContact.phoneNumber}</div>
                <div>{primaryContact.address}</div>
            </Col>}
            <Col xs={"6"}>
                {lastnames && lastnames.map((lastname, index) => (
                        <div key={index}>{lastname}</div>
                ))}
            </Col>
        </Row>
    </Container>)

PrimaryContactInfo.propTypes = {
    lastnames: PropTypes.arrayOf(PropTypes.string),
    primaryContact: PropTypes.shape({
                                        name: PropTypes.string.isRequired,
                                        email: PropTypes.string,
                                        phoneNumber: PropTypes.string,
                                        address: PropTypes.string,
                                    }).isRequired,
};

export default PrimaryContactInfo;
