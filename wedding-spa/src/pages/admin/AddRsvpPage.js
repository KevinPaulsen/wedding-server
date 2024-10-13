import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import RsvpTable from "../../components/admin/RsvpTable";

const AddRsvpPage = () => {
    return (
        <AdminLayout children={
            <RsvpTable />
        }/>
    );
}


export default AddRsvpPage;
