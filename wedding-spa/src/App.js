import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Header from './components/home/Header';
import PhotoSection from './components/home/PhotoSection';
import Schedule from './components/home/Schedule';
import WeddingDetails from './components/home/WeddingDetails';
import Countdown from './components/home/Countdown';
import RSVPCodePage from './components/rsvp/RSVPCodePage';
import PreferredInfoPage from './components/rsvp/PreferredInfoPage';
import StatusPage from './components/rsvp/StatusPage';
import ConfirmationPage from './components/rsvp/ConfirmationPage';
import {FlowProvider} from "./FlowProvider";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./auth/PrivateRoute";
import NotFound from "./components/NotFound";

function App() {
    return (
        <FlowProvider>
            <Routes>
                <Route path="/admin/login" element={<AdminLogin/>}/>
                <Route path="/login" element={<Navigate to="/admin/login" replace/>}/>
                <Route path="/admin" element={<Navigate to="/admin/login" replace/>}/>
                <Route
                    path="/admin/dashboard"
                    element={<PrivateRoute component={<AdminDashboard/>}/>}
                />
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace/>}/>
                <Route path="/" element={
                    <div>
                        <Header/>
                        <PhotoSection/>
                        <Schedule/>
                        <WeddingDetails/>
                        <Countdown/>
                    </div>
                }/>
                <Route path="/rsvp" element={<RSVPCodePage/>}/>
                <Route path="/rsvp-info" element={<PreferredInfoPage/>}/>
                <Route path="/rsvp-status" element={<StatusPage/>}/>
                <Route path="/rsvp-confirmation" element={<ConfirmationPage/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </FlowProvider>
    );
}

export default App;
