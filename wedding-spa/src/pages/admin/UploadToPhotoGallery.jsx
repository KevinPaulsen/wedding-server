import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFileUploadComponent from "../../components/admin/AdminFileUploadComponent";

const AdminRsvpInfoPage = () => {
    return (<AdminLayout children={<AdminFileUploadComponent />}/>);
}


export default AdminRsvpInfoPage;
