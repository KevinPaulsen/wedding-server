// AdminRsvpController.tsx
import React from 'react';
import RsvpTable from './RsvpTable';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDelete";

const AdminRsvpController: React.FC = () => {
    const { data, removeRsvp, updateRsvpInState } = useRsvpData();
    const { execute: deleteRsvp, error: deleteError } = useDeleteRsvp();

    const handleDelete = async (rsvpCode: string) => {
        await deleteRsvp(rsvpCode);
        if (!deleteError) {
            removeRsvp(rsvpCode);
        }
    };

    return (
            <RsvpTable
                rsvpData={data}
                deleteRsvp={handleDelete}
                error={deleteError}

                // Pass down a callback that can update local data
                updateRsvpInState={updateRsvpInState}
            />
    );
};

export default AdminRsvpController;
