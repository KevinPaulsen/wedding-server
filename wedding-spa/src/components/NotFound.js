import React from 'react';
import {Link} from 'react-router-dom';

function NotFound() {
    return (
        <div className="container text-center mt-5">
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );
}

export default NotFound;
