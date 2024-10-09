import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import RSVPCodePage from './pages/rsvp/RSVPCodePage';
import PreferredInfoPage from './pages/rsvp/PreferredInfoPage';
import StatusPage from './pages/rsvp/StatusPage';
import ConfirmationPage from './pages/rsvp/ConfirmationPage';
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./auth/PrivateRoute";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";
import './styles/App.css';
import Story from "./pages/StoryPage";
import Contact from "./pages/ContactPage";
import Details from "./pages/Details";
import Gallery from "./pages/GalleryPage";

function App() {
    return (
        <Routes>
            {/* Login page/redirects */}
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/login" element={<Navigate to="/admin/login" replace/>}/>
            <Route path="/admin" element={<Navigate to="/admin/login" replace/>}/>

            {/* Dashboard Page/redirects */}
            <Route path="/admin/dashboard" element={<PrivateRoute component={<AdminDashboard/>}/>}/>
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace/>}/>

            <Route path="/" element={<HomePage/>}/>
            <Route path="/gallery" element={<Gallery/>}/>
            <Route path="/details" element={<Details/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/story" element={<Story/>}/>

            {/* RSVP Pages*/}
            <Route path="/rsvp" element={<RSVPCodePage/>}/>
            <Route path="/rsvp-info" element={<PreferredInfoPage/>}/>
            <Route path="/rsvp-status" element={<StatusPage/>}/>
            <Route path="/rsvp-confirmation" element={<ConfirmationPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default App;
