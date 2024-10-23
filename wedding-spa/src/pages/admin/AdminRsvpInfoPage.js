import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminRsvpController from "../../components/admin/adminRsvpTable/AdminRsvpController";

const AdminRsvpInfoPage = () => {
    return (<AdminLayout children={<AdminRsvpController />}/>);
}


export default AdminRsvpInfoPage;
