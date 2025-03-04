// components/shared/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const NotFound: React.FC = () => {
    return (
        <Container className="text-center mt-5">
            <h2>404 - Page Not Found</h2>
            <p>The page you&apos;re looking for doesn&apos;t exist.</p>
            <Link to="/" className="btn btn-primary">
                Go Home
            </Link>
        </Container>
    );
};

export default NotFound;
