import React from 'react';
import {Container, Row} from 'react-bootstrap';
import Header from "../headerComponents/Header";

const BaseLayout = ({children}) => {
    return (
        <Container fluid className="d-flex flex-column min-vh-100 p-0" style={{backgroundColor: 'var(--main-light)'}}>
            <Row className='g-0'>
                <Header/>
            </Row>
            <Row className="flex-grow-1 g-0">
                {children}
            </Row>
        </Container>
    );
};

export default BaseLayout;
