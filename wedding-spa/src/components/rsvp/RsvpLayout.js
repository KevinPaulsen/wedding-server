import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import Title from "../headerComponents/Title";
import CancelButton from "./CancelButton";

const RsvpLayout = (props) => {
    return (
        <Container fluid className="d-flex flex-column vh-100 p-0" style={{backgroundColor: 'var(--main-light)'}}>
            <Row className='g-0 mt-5 text-center align-items-center'>
                <Col>
                    <Title />
                </Col>
            </Row>

            <Row className="flex-grow-1 align-items-center justify-content-center text-center fade-in">
                <Col className="col-auto">
                    <h3 className="pb-4"> {props.title} </h3>
                    {props.children}
                </Col>
            </Row>

            <Row style={{height: '75px'}} className='mb-5 text-center justify-content-center align-items-center'>
                {props.cancel && (
                    <Col>
                        <CancelButton />
                    </Col>
                )}
            </Row>
        </Container>
)
    ;
};

export default RsvpLayout;
