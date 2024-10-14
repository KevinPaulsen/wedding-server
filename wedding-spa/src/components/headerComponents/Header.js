import React from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import '../../styles/Header.css';
import {Link} from "react-router-dom";
import FullScreenMenu from "./FullScreenMenu";
import Title from "./Title";


const WeddingHeader = () => {
    return (
        <Container className="py-5 px-1 px-sm-5 text-center">
            {/* Header Row - HomePage Button, Stack Button, Title */}
            <Row className="g-0 align-items-center">
                <Col className="col-1 d-flex justify-content-start">
                </Col>
                <Col className={"col-10 d-flex justify-content-center"}>
                    <Title/>
                </Col>
                <Col className={'col-1 d-flex justify-content-end'}>
                    <FullScreenMenu/>
                </Col>
            </Row>

            {/* Content Row - RSVP Button, Navigation */}
            <Row className="g-0 mt-3 justify-content-center align-items-center d-sm-flex d-none"
                 style={{backgroundcolor: 'red'}}>
                {/* Left Links */}
                <Col className="d-flex justify-content-end text-center flex-grow-1 gap-3">
                    <Link to="/gallery" className='nav-link'>Gallery</Link>
                    <Link to="/details" className='nav-link'>Details</Link>
                </Col>

                {/* Centered Button */}
                <Col xs="auto" className='mx-3'>
                    <Button as={Link} to="/rsvp" className='custom-button dark'>RSVP</Button>
                </Col>

                {/* Right Links */}
                <Col className="d-flex justify-content-start flex-grow-1 gap-3">
                    <Link to="/contact" className='nav-link'>Contact</Link>
                    <Link to="/story" className='nav-link'>Our Story</Link>
                </Col>
            </Row>

            {/* RSVP Button for Small Screens */}
            <Row className="g-0 mt-3 justify-content-center d-sm-none">
                <Button as={Link} to="/rsvp" className='custom-button dark'>
                    RSVP
                </Button>
            </Row>
        </Container>
    );
};

export default WeddingHeader;
