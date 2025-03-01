// Header.tsx
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import '../../../styles/Header.css';
import {Link, useNavigate} from 'react-router-dom';
import FullScreenMenu from "./FullScreenMenu";
import Title from "./Title";
import CustomButton from "../../shared/CustomButton";

const WeddingHeader: React.FC = () => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/rsvp");
    }

    return (
        <Container className="py-5 px-1 px-sm-5 text-center">
            {/* Header Row - HomePage Button, Stack Button, Title */}
            <Row className="g-0 align-items-center">
                <Col className="col-1 d-flex justify-content-start"></Col>
                <Col className="col-10 d-flex justify-content-center">
                    <Title />
                </Col>
                <Col className="col-1 d-flex justify-content-end">
                    <FullScreenMenu />
                </Col>
            </Row>

            {/* Content Row - RSVP Button, Navigation */}
            <Row className="g-0 mt-3 justify-content-center align-items-center d-sm-flex d-none" >
                {/* Left Links */}
                <Col className="d-flex justify-content-end text-center flex-grow-1 gap-3">
                    <Link to="/gallery" className="nav-link">Gallery</Link>
                    <Link to="/details" className="nav-link">Details</Link>
                </Col>

                {/* Centered Button */}
                <Col xs="auto" className="mx-3">
                    <CustomButton
                        text="RSVP"
                        onClick={handleClick}
                        variant="dark"
                        width="80px"
                        height="40px"
                    />
                </Col>

                {/* Right Links */}
                <Col className="d-flex justify-content-start flex-grow-1 gap-3">
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/story" className="nav-link">Our Story</Link>
                </Col>
            </Row>

            {/* RSVP Button for Small Screens */}
            <Row className="g-0 mt-3 justify-content-center d-sm-none">
                <CustomButton
                    text="RSVP"
                    onClick={handleClick}
                    variant="dark"
                    width="80px"
                />
            </Row>
        </Container>
    );
};

export default WeddingHeader;
