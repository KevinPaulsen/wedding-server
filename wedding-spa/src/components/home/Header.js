import React from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Header.css'

const Header = () => {
    return (
        <header className="text-center my-5">
            <h1 className="elegant-title">Kevin & Olivia</h1>
            <Link to="/rsvp">
                <button className="btn btn-dark mt-3 rsvp-button">RSVP</button>
            </Link>
        </header>
    );
};

export default Header;

