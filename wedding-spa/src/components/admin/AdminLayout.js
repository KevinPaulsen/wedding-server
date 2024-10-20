import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {IoHome} from "react-icons/io5";
import "../../styles/Header.css"

const AdminLayout = ({children}) => {
    return (<Container fluid className="d-flex flex-column min-vh-100 p-0">
                <Row className='g-0'>
                    <Container className="pt-5 pb-3 px-1 px-sm-5 text-center">
                        {/* Header Row - HomePage Button, Stack Button, Title */}
                        <Row className="g-0 align-items-center">
                            <Col className="col-1 justify-content-center">
                                <Link to="/">
                                    <IoHome size={30} color="var(--main-dark)"/>
                                </Link>
                            </Col>
                            <Col className={"col-10 justify-content-center"}>
                                <h1 className='title'>
                                    Admin Page
                                </h1>
                            </Col>
                            <Col className={'col-1 d-flex justify-content-end'}></Col>
                        </Row>

                        {/* Content Row - RSVP Button, Navigation */}
                        <Row className="g-0 mt-3 justify-content-center align-items-center">
                            {/* Left Links */}
                            <Col className="d-flex justify-content-center text-center flex-grow-1 gap-3">
                                <Link to="/admin/guests" className='nav-link'>Guest List</Link>
                                <Link to="/admin/dashboard" className='nav-link'>RSVP Info</Link>
                                <Link to="/admin/add-rsvp" className='nav-link'>Add RSVP</Link>
                            </Col>
                        </Row>
                    </Container>
                </Row>
                <Row className="flex-grow-1 g-0">
                    {children}
                </Row>
            </Container>);
};

export default AdminLayout;
