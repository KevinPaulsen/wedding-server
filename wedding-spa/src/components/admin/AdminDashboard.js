// AdminDashboard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RsvpTable from "./RsvpTable";

function AdminDashboard() {
    return (
        <div>
            {/* Main Content */}
            <div className="container-fluid">
                <div className="row">
                    <h1 className="mt-4">Welcome, Admin!</h1>
                    <p>This is your dashboard where you can manage the application.</p>

                    <RsvpTable />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
