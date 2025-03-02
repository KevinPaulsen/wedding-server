// AdminRsvpController.tsx
import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import RsvpTable from './RsvpTable';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDelete";

const AdminRsvpController: React.FC = () => {
    // useRsvpData now returns { data, loading, error, removeRsvp }
    const { data, removeRsvp } = useRsvpData();
    // useDeleteRsvp now returns { execute, error } (renamed execute to deleteRsvp)
    const { execute: deleteRsvp, error: deleteError } = useDeleteRsvp();

    const handleDelete = async (rsvpCode: string) => {
        await deleteRsvp(rsvpCode);
        if (!deleteError) {
            removeRsvp(rsvpCode);
        }
    };

    return (
        <Container className="mt-4">
            <RsvpTable rsvpData={data} deleteRsvp={handleDelete} error={deleteError} />
        </Container>
    );
};

export default AdminRsvpController;
