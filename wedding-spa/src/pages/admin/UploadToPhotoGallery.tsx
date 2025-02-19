// UploadToPhotoGallery.tsx
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFileUploadComponent from "../../components/admin/adminGalleryControl/AdminFileUploadComponent";
import AdminGalleryComponent from "../../components/admin/adminGalleryControl/AdminGalleryComponent";

const AdminRsvpInfoPage: React.FC = () => {
    return (
        <AdminLayout>
            <>
                <AdminFileUploadComponent />
                <AdminGalleryComponent />
            </>
        </AdminLayout>
    );
};

export default AdminRsvpInfoPage;
