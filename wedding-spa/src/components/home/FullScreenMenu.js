import React, {useState} from 'react';
import {Button, Container} from 'react-bootstrap';
import '../../styles/FullScreenMenu.css';

const FullScreenMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className={`menu-button-container ${menuOpen ? 'above-overlay' : ''}`}>
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
                <Container className="d-flex flex-column justify-content-center align-items-center h-100">
                    <a href="/gallery" className="menu-link">Gallery</a>
                    <a href="/details" className="menu-link">Details</a>
                    <a href="/contact" className="menu-link">Contact</a>
                    <a href="/story" className="menu-link">Our Story</a>
                </Container>
            </div>
        </>
    );
};

export default FullScreenMenu;