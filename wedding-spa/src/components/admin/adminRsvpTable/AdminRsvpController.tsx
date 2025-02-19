// AdminRsvpController.tsx
import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import RsvpTable from './RsvpTable';
import FilterControls from './FilterControls';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDeleteRsvp";

const AdminRsvpController: React.FC = () => {
    // useRsvpData now returns { data, loading, error, removeRsvp }
    const { data, removeRsvp } = useRsvpData();
    // useDeleteRsvp now returns { execute, error } (renamed execute to deleteRsvp)
    const { execute: deleteRsvp, error: deleteError } = useDeleteRsvp();

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
        if (!deleteError) {
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
