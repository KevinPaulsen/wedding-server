// App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from "./components/admin/AdminLogin";
import PrivateRoute from "./auth/PrivateRoute";
import NotFound from "./components/NotFound";
import HomePage from "./pages/home/HomePage";
import './styles/App.css';
import Story from "./pages/home/StoryPage";
import Contact from "./pages/home/ContactPage";
import Details from "./pages/home/Details";
import Gallery from "./pages/home/GalleryPage";
import AdminMain from "./pages/admin/AdminRsvpInfoPage";
import GuestListPage from "./pages/admin/GuestListPage";
import AddRsvpPage from "./pages/admin/AddRsvpPage";
import RsvpFlowPage from "./pages/rsvp/RsvpFlowPage";
import AdminRsvpFlow from "./pages/admin/AdminRsvpFlow";
import UploadPhotoPage from "./pages/admin/UploadToPhotoGallery";

const App: React.FC = () => {
    return (
        <Routes>
            {/* Login page/redirects */}
        <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/login" element={<Navigate to="/admin/login" replace />} />
    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

    {/* Dashboard Page/redirects */}
    <Route path="/admin/dashboard" element={<PrivateRoute component={<AdminMain />} />} />
    <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

    <Route path="/admin/edit-rsvp" element={<PrivateRoute component={<AdminRsvpFlow />} />} />

    <Route path="/admin/guests" element={<PrivateRoute component={<GuestListPage />} />} />
    <Route path="/admin/add-photos" element={<PrivateRoute component={<UploadPhotoPage />} />} />
    <Route path="/admin/add-rsvp" element={<PrivateRoute component={<AddRsvpPage />} />} />

    <Route path="/" element={<HomePage />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/details" element={<Details />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/story" element={<Story />} />

    {/* RSVP Pages */}
    <Route path="/rsvp" element={<RsvpFlowPage />} />

    <Route path="*" element={<NotFound />} />
    </Routes>
);
};

export default App;
