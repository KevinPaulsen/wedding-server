import React from 'react';
import {Button, Col, Container, Nav, Navbar, Row} from 'react-bootstrap';
import '../../styles/Header.css';
import {Link} from "react-router-dom";
import FullScreenMenu from "./FullScreenMenu";
import {AiOutlineHome} from 'react-icons/ai';


const WeddingHeader = () => {
    return (
        <Container className="text-center">
            <Row className="mt-5 justify-content-center align-items-center">
                <Col className="col-2 d-flex justify-content-end">
                    <Button as={Link} to="/" className="home-button">
                        <AiOutlineHome/>
                    </Button>
                </Col>
                <Col className={"col-8"}>
                    <h1 className='title'>Kevin & Olivia</h1>
                    <Navbar expand={"sm"}>
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
                </Col>
                <Col className={'p-0 col-2 text-start'}>
                    <div className='d-sm-none'>
                        <FullScreenMenu/>
                    </div>
                </Col>
            </Row>
            <Row className="mb-5 justify-content-center align-items-center">
                <Button as={Link} to="/rsvp" className='custom-button d-sm-none fixed-size-btn'>RSVP</Button>
            </Row>
        </Container>
    );
};

export default WeddingHeader;
