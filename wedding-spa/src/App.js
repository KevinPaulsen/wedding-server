import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import RSVPCodePage from './pages/rsvp/RSVPCodePage';
import PreferredInfoPage from './pages/rsvp/PreferredInfoPage';
import StatusPage from './pages/rsvp/StatusPage';
import ConfirmationPage from './pages/rsvp/ConfirmationPage';
import AdminLogin from "./components/admin/AdminLogin";
import PrivateRoute from "./auth/PrivateRoute";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";
import './styles/App.css';
import Story from "./pages/StoryPage";
import Contact from "./pages/ContactPage";
import Details from "./pages/Details";
import Gallery from "./pages/GalleryPage";
import GuestsPage from "./pages/rsvp/GuestsPage";
import AddGuestPage from "./pages/rsvp/AddGuestPage";
import AdminMain from "./pages/admin/AdminRsvpInfoPage";
import GuestListPage from "./pages/admin/GuestListPage";
import AddRsvpPage from "./pages/admin/AddRsvpPage";

function App() {
    return (
        <Routes>
            {/* Login page/redirects */}
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/login" element={<Navigate to="/admin/login" replace/>}/>
            <Route path="/admin" element={<Navigate to="/admin/login" replace/>}/>

            {/* Dashboard Page/redirects */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace/>}/>

            <Route path="/admin/dashboard" element={<PrivateRoute component={<AdminMain/>}/>}/>
            <Route path="/admin/guests" element={<PrivateRoute component={<GuestListPage/>}/>}/>
            <Route path="/admin/add-rsvp" element={<PrivateRoute component={<AddRsvpPage/>}/>}/>

            <Route path="/" element={<HomePage/>}/>
            <Route path="/gallery" element={<Gallery/>}/>
            <Route path="/details" element={<Details/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/story" element={<Story/>}/>

            {/* RSVP Pages*/}
            <Route path="/rsvp" element={<RSVPCodePage/>}/>
            <Route path="/rsvp-info" element={<PreferredInfoPage/>}/>
            <Route path="/rsvp-guests" element={<GuestsPage/>}/>
            <Route path="/rsvp-add-guest" element={<AddGuestPage/>}/>
            <Route path="/rsvp-status" element={<StatusPage/>}/>
            <Route path="/rsvp-confirmation" element={<ConfirmationPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default App;
