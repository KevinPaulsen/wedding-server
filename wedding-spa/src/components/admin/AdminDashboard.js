// AdminDashboard.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Admin Dashboard</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>

            {/* Main Content */}
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        <div className="sidebar-sticky pt-3">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">
                                        Dashboard
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Users
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Main Section */}
                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                        <h1 className="mt-4">Welcome, Admin!</h1>
                        <p>This is your dashboard where you can manage the application.</p>

                        {/* Example Cards */}
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card mb-4 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal">Users</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title">24</h1>
                                        <p>Active Users</p>
                                        <button type="button" className="btn btn-lg btn-block btn-primary">Manage
                                            Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card mb-4 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal">Reports</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title">12</h1>
                                        <p>Pending Reports</p>
                                        <button type="button" className="btn btn-lg btn-block btn-primary">View
                                            Reports
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card mb-4 shadow-sm">
                                    <div className="card-header">
                                        <h4 className="my-0 font-weight-normal">Settings</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title"><i className="fas fa-cogs"></i>
                                        </h1>
                                        <p>Configure Settings</p>
                                        <button type="button" className="btn btn-lg btn-block btn-primary">Go to
                                            Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
