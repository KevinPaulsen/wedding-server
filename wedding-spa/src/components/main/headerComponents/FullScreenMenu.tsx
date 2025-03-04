// components/main/headerComponents/FullScreenMenu.tsx
import React, { useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import '../../../styles/FullScreenMenu.css';
import {Link, useNavigate} from 'react-router-dom';
import Title from "./Title";
import CustomButton from "../../shared/CustomButton";

const FullScreenMenu: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const navigate = useNavigate()

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleRsvpClick = () => {
        navigate("/rsvp");
    }

    return (
        <>
            <div className={`d-sm-none menu-button-container ${menuOpen ? 'above-overlay' : ''}`}>
                <Button
                    onClick={toggleMenu}
                    className={`menu-button ${menuOpen ? 'open' : ''}`}
                    aria-label="Toggle Menu"
                >
                    <div className="menu-icon">
                        <div className="line top-line"></div>
                        <div className="line middle-line"></div>
                        <div className="line bottom-line"></div>
                    </div>
                </Button>
            </div>

            <div className={`fullscreen-overlay ${menuOpen ? 'show' : ''}`}>
                <Container className="h-100">
                    <Row className="mt-5 align-items-center" style={{ height: '50px' }}>
                        <Title color="var(--main-light)" />
                    </Row>
                    <Row className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                        <Link to="/gallery" className="menu-link">Gallery</Link>
                        <Link to="/details" className="menu-link">Details</Link>
                        <Link to="/contact" className="menu-link">Contact</Link>
                        <Link to="/story" className="menu-link">Our Story</Link>
                    </Row>
                    <Row className="mb-5 justify-content-center align-items-center">
                        <CustomButton
                            text="RSVP"
                            onClick={handleRsvpClick}
                            variant="lightOutlined"
                            width="80px"
                            height="40px"
                        />
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default FullScreenMenu;
