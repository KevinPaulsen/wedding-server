import React from 'react';
import {Button, Col, Container, Nav, Navbar, Row} from 'react-bootstrap';
import '../../styles/Header.css';
import {Link} from "react-router-dom";
import FullScreenMenu from "./FullScreenMenu";
import HomeButton from "./HomeButton";


const WeddingHeader = () => {
    return (
        <Container className="py-5 px-1 px-sm-3 text-center">
            {/* Header Row - Home Button, Stack Button, Title */}
            <Row className="g-0 align-items-center">
                <Col className="col-1 d-flex justify-content-start">
                    <HomeButton/>
                </Col>
                <Col className={"col-10 d-flex justify-content-center"}>
                    <h1 className='title'>Kevin & Olivia</h1>
                </Col>
                <Col className={'col-1 d-flex justify-content-end'}>
                    <FullScreenMenu/>
                </Col>
            </Row>

            {/* Content Row - RSVP Button, Navigation */}
            <Row className="g-0 mt-3 justify-content-center">
                <Navbar className='p-0 d-none d-sm-block'>
                    <Navbar.Collapse id="navbar-nav" className="justify-content-center align-items-center">
                        <Nav>
                            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                            <Nav.Link as={Link} to="/details">Details</Nav.Link>
                        </Nav>
                        <Button as={Link} to="/rsvp" className='custom-button fixed-size-btn'>RSVP</Button>
                        <Nav>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                            <Nav.Link as={Link} to="/story">Our Story</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Button as={Link} to="/rsvp" className='custom-button d-sm-none fixed-size-btn'>
                    RSVP
                </Button>
            </Row>
        </Container>
    );
};

export default WeddingHeader;
