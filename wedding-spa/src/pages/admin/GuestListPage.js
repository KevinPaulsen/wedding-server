import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import RsvpList from "../../components/admin/RsvpList";

const AdminRsvpInfomPage = () => {
    return (
        <AdminLayout children={
            <RsvpList />
        }/>
    );
}


export default AdminRsvpInfomPage;
