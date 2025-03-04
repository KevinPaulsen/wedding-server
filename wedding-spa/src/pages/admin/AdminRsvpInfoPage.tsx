// src/pages/admin/AdminRsvpInfoPage.tsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRsvpController from '../../components/admin/adminRsvpTable/AdminRsvpController';

const AdminRsvpInfoPage: React.FC = () => {
    return (
        <AdminLayout title="RSVP Table Information">
            <AdminRsvpController />
        </AdminLayout>
    );
};

export default AdminRsvpInfoPage;
