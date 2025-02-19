// FilterControls.tsx
import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';

interface FilterControlsProps {
    filters: {
        status: string;
        sortBy: string;
    };
    onFilterChange: (newFilters: { status: string; sortBy: string }) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            status: event.target.value,
        });
    };

    return (
        <Form className="mb-3">
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Form.Group controlId="filterStatus">
                        <Form.Label column="lg">Status</Form.Label>
                        <Form.Select value={filters.status} onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="ATTENDING">Attending</option>
                            <option value="NOT_ATTENDING">Not Attending</option>
                            <option value="PENDING">Pending</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col className="col-auto">
                    <Form.Group controlId="sortBy">
                        <Form.Label column="lg">Sort By</Form.Label>
                        <Form.Select value={filters.status} onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="ATTENDING">Attending</option>
                            <option value="NOT_ATTENDING">Not Attending</option>
                            <option value="PENDING">Pending</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default FilterControls;
