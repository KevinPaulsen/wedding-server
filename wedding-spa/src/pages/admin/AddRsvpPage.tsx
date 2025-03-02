// AddRsvpPage.tsx
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AddRsvp from "../../components/admin/AddRsvp";

const AddRsvpPage: React.FC = () => {
    return (
        <AdminLayout title="Add RSVP">
            <AddRsvp />
        </AdminLayout>
    );
};

export default AddRsvpPage;
