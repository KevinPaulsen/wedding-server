import React from 'react';
import {Button, Col, Container, Nav, Navbar, Row} from 'react-bootstrap';
import '../../styles/Header.css';
import {Link} from "react-router-dom";
import FullScreenMenu from "./FullScreenMenu";
import HomeButton from "./HomeButton";
import Title from "./Title";


const WeddingHeader = () => {
    return (
        <Container className="py-5 px-1 px-sm-5 text-center">
            {/* Header Row - HomePage Button, Stack Button, Title */}
            <Row className="g-0 align-items-center">
                <Col className="col-1 d-flex justify-content-start">
                    <HomeButton/>
                </Col>
                <Col className={"col-10 d-flex justify-content-center"}>
                    <Title />
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
                        <Button as={Link} to="/rsvp" className='custom-button dark'>RSVP</Button>
                        <Nav>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                            <Nav.Link as={Link} to="/story">Our Story</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Button as={Link} to="/rsvp" className='custom-button dark d-sm-none'>
                    RSVP
                </Button>
            </Row>
        </Container>
    );
};

export default WeddingHeader;
