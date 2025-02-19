// UploadToPhotoGallery.jsx
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFileUploadComponent from "../../components/admin/adminGalleryControl/AdminFileUploadComponent";
import AdminGalleryComponent from "../../components/admin/adminGalleryControl/AdminGalleryComponent";

const AdminRsvpInfoPage = () => {
    return (<AdminLayout children={
        <>
            <AdminFileUploadComponent />
            <AdminGalleryComponent />
        </>
    }/>);
}


export default AdminRsvpInfoPage;
