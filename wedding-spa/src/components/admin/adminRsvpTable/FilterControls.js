// FilterControls.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FilterControls = ({ filters, onFilterChange }) => {
    const handleStatusChange = (event) => {
        onFilterChange({
                           ...filters,
                           status: event.target.value,
                       });
    };

    const handleSortByChange = (event) => {
        onFilterChange({
                           ...filters,
                           sortBy: event.target.value,
                       });
    };

    return (
            <Form className="mb-3">
                <Row className="justify-content-center">
                    <Col className="col-auto">
                        <Form.Group controlId="filterStatus">
                            <Form.Label column={"lg"}>Status</Form.Label>
                            <Form.Control
                                    as="select"
                                    value={filters.status}
                                    onChange={handleStatusChange}
                            >
                                <option value="">All</option>
                                <option value="ATTENDING">Attending</option>
                                <option value="NOT_ATTENDING">Not Attending</option>
                                <option value="PENDING">Pending</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-auto">
                        <Form.Group controlId="sortBy">
                            <Form.Label column={"lg"}>Sort By</Form.Label>
                            <Form.Control
                                    as="select"
                                    value={filters.sortBy}
                                    onChange={handleSortByChange}
                            >
                                <option value="">None</option>
                                <option value="lastName">Last Name</option>
                                <option value="rsvpCode">RSVP Code</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
    );
};

export default FilterControls;
