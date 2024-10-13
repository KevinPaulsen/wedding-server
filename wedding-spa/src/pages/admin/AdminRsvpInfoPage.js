import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import RsvpTable from "../../components/admin/RsvpTable";

const AdminRsvpInfoPage = () => {
    return (
        <AdminLayout children={
            <RsvpTable />
        }/>
    );
}


export default AdminRsvpInfoPage;
