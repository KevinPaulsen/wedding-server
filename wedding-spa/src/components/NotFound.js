// NotFound.js
import React from 'react';
import {Link} from 'react-router-dom';
import {Container} from "react-bootstrap";

function NotFound() {
    return (<Container className="text-center mt-5">
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </Container>);
}

export default NotFound;
