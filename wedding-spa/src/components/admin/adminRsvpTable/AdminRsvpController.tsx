// components/admin/adminRsvpTable/AdminRsvpController.tsx
import React from 'react';
import RsvpTable from './RsvpTable';
import {useRsvpData} from "../../../hooks/rsvp/useRsvpData";
import {useDeleteRsvp} from "../../../hooks/rsvp/useDelete";
import {useCreateRsvp} from "../../../hooks/rsvp/useCreateRsvp";
import {CreateRsvpDTO} from "../../../types/RsvpDTO";
import {Rsvp} from "../../../types/rsvp";

const AdminRsvpController: React.FC = () => {
    const { data, removeRsvp, addRsvp, updateRsvpInState } = useRsvpData();
    const { execute: deleteRsvp, error: deleteError, loading: deleteLoading } = useDeleteRsvp();
    const { execute: createRsvp, error: addError, loading: addLoading } = useCreateRsvp();

    const handleDelete = async (rsvpCode: string) => {
        const response = await deleteRsvp(rsvpCode);

        if (response.success) {
            removeRsvp(rsvpCode);
        }
    };

    const handleAdd = async (createDTO: CreateRsvpDTO) => {
        const response = await createRsvp(createDTO);

        if (response.success) {
            addRsvp(response.data as Rsvp);
            return true;
        }

         return false;
    };

    return (
            <RsvpTable
                rsvpData={data}
                deleteRsvp={handleDelete}
                deleteError={deleteError}
                deleteLoading={deleteLoading}
                createRsvp={handleAdd}
                createError={addError}
                createLoading={addLoading}

                updateRsvpInState={updateRsvpInState}
            />
    );
};

export default AdminRsvpController;
