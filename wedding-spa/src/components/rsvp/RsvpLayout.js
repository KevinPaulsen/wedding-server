import React from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import Title from "../headerComponents/Title";
import CancelButton from "./CancelButton";

const RsvpLayout = (props) => {
    return (
        <Container fluid className="d-flex flex-column vh-100 p-0" style={{backgroundColor: '#ece4da'}}>
            <Row className='g-0 mt-5 text-center align-items-center'>
                <Col>
                    <Title />
                </Col>
            </Row>
            <Row className="g-0 flex-grow-1 align-items-center">
                {props.children}
            </Row>
            <Row className='g-0 mb-5 text-center align-items-center'>
                <Col>
                    <CancelButton />
                </Col>
            </Row>
        </Container>
)
    ;
};

export default RsvpLayout;
