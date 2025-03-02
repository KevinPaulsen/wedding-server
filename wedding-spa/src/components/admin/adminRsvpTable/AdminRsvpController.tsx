// AdminRsvpController.tsx
import React from 'react';
import RsvpTable from './RsvpTable';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDelete";

const AdminRsvpController: React.FC = () => {
    const { data, removeRsvp, updateRsvpInState } = useRsvpData();
    const { execute: deleteRsvp, error: deleteError, loading: deleteLoading } = useDeleteRsvp();

    const handleDelete = async (rsvpCode: string) => {
        const response = await deleteRsvp(rsvpCode);

        if (response.success) {
            removeRsvp(rsvpCode);
        } else {
            console.error(response.error);
        }
    };


    return (
            <RsvpTable
                rsvpData={data}
                deleteRsvp={handleDelete}
                error={deleteError}
                loading={deleteLoading}

                // Pass down a callback that can update local data
                updateRsvpInState={updateRsvpInState}
            />
    );
};

export default AdminRsvpController;
