// AddRsvpPage.tsx
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AddRsvp from "../../components/admin/AddRsvp";

const AddRsvpPage: React.FC = () => {
    return (
        <AdminLayout>
            <AddRsvp />
        </AdminLayout>
    );
};

export default AddRsvpPage;
