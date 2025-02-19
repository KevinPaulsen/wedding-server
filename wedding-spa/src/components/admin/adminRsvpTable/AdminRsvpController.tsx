// AdminRsvpController.js
import React, { useState } from 'react';
import RsvpTable from './RsvpTable';
import FilterControls from './FilterControls';
import { Container } from "react-bootstrap";
import useRsvpData from "../../../hooks/useRsvpData";
import { useDeleteRsvp } from "../../../hooks/useDeleteRsvp";

const AdminRsvpController: React.FC = () => {
    const { removeRsvp, data, error } = useRsvpData();
    const { deleteRsvp, deleteError } = useDeleteRsvp();
    const [filters, setFilters] = useState({
        status: '',
        sortBy: '',
    });

    const handleFilterChange = (newFilters: { status: string; sortBy: string }) => {
        setFilters(newFilters);
    };

    const filteredData = data
        .filter(entry => !(filters.status && entry.rsvpStatus !== filters.status))
        .sort((a, b) => {
            if (filters.sortBy === 'lastName') {
                return a.lastnames[0].localeCompare(b.lastnames[0]);
            } else if (filters.sortBy === 'rsvpCode') {
                return a.rsvpCode.localeCompare(b.rsvpCode);
            } else {
                return 0;
            }
        });

    const handleDelete = async (rsvpCode: string) => {
        await deleteRsvp(rsvpCode);
        if (!error) {
            removeRsvp(rsvpCode);
        }
    };

    return (
        <Container className="mt-4">
            <FilterControls filters={filters} onFilterChange={handleFilterChange} />
            <RsvpTable rsvpData={filteredData} deleteRsvp={handleDelete} error={deleteError} />
        </Container>
    );
};

export default AdminRsvpController;
