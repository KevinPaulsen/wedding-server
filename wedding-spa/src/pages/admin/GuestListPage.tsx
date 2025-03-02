// GuestListPage.tsx
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminRsvpController from "../../components/admin/adminRsvpTable/AdminRsvpController";

const GuestListPage: React.FC = () => {
    return (
        <AdminLayout title="Guest List Table">
            <AdminRsvpController />
        </AdminLayout>
    );
};

export default GuestListPage;
