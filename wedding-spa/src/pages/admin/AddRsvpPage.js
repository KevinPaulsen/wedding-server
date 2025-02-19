// AddRsvpPage.js
import React from 'react';
import AdminLayout from "../../components/admin/AdminLayout";
import AddRsvp from "../../components/admin/AddRsvp";

const AddRsvpPage = () => {
    return (<AdminLayout children={<AddRsvp/>}/>);
}


export default AddRsvpPage;
