// BaseLayout.tsx
import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Header from "./headerComponents/Header";

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <Container fluid className="d-flex flex-column min-vh-100 p-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <Row className="g-0">
                <Header />
            </Row>
            <Row className="g-0">
                {children}
            </Row>
        </Container>
    );
};

export default BaseLayout;
