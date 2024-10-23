import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AdminRsvpController from "../../components/admin/adminRsvpTable/AdminRsvpController";

const GuestListPage = () => {
    return (<AdminLayout children={<AdminRsvpController/>}/>);
}


export default GuestListPage;
