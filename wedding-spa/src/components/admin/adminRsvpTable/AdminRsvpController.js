// AdminRsvpController.js
import React, {useState} from 'react';
import RsvpTable from './RsvpTable.js';
import FilterControls from './FilterControls';
import {Container} from "react-bootstrap";
import useRsvpData from "../../../hooks/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/useDeleteRsvp";

const AdminRsvpController = () => {
    const {removeRsvp, data, error} = useRsvpData();
    const {deleteRsvp, deleteError} = useDeleteRsvp();
    const [filters, setFilters] = useState({
                                               status: '',
                                               sortBy: '',
                                           });

    // Handle changes in filters
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Apply filters and sorting to the RSVP data
    const filteredData = data
            .filter((entry) => {
                return !(filters.status && entry.rsvpStatus !== filters.status);
            })
            .sort((a, b) => {
                if (filters.sortBy === 'lastName') {
                    return a.lastnames[0].localeCompare(b.lastnames[0]);
                } else if (filters.sortBy === 'rsvpCode') {
                    return a.rsvpCode.localeCompare(b.rsvpCode);
                } else {
                    return 0;
                }
            });

    const handleDelete = async (rsvpCode) => {
        await deleteRsvp(rsvpCode);

        if (!error) {
            removeRsvp(rsvpCode);
        }
    }

    return (
            <Container className="mt-4">
                <FilterControls filters={filters} onFilterChange={handleFilterChange} />
                <RsvpTable rsvpData={filteredData} deleteRsvp={handleDelete} error={deleteError} />
            </Container>
    );
};

export default AdminRsvpController;
