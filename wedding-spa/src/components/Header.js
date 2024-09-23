import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="text-center my-5">
            <h1 className="display-4">Kevin & Olivia</h1>
            <h2 className="display-6">09.13.25</h2>
            <Link to="/rsvp">
                <button className="btn btn-dark mt-3">RSVP</button>
            </Link>
        </header>
    );
};

export default Header;

