// AdminRsvpController.tsx
import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import RsvpTable from './RsvpTable';
import FilterControls from './FilterControls';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDelete";

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
        .sort((a, b) => {
            if (filters.sortBy === 'lastName') {
                return 1;
            } else if (filters.sortBy === 'rsvpCode') {
                return -1;
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
