// App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminLogin from "../components/admin/AdminLogin";
import PrivateRoute from "../routes/PrivateRoute";
import NotFound from "../components/shared/NotFound";
import HomePage from "../pages/home/HomePage";
import Story from "../pages/home/StoryPage";
import Contact from "../pages/home/ContactPage";
import Details from "../pages/home/Details";
import Gallery from "../pages/home/GalleryPage";
import AdminMain from "../pages/admin/AdminRsvpInfoPage";
import GuestListPage from "../pages/admin/GuestListPage";
import AddRsvpPage from "../pages/admin/AddRsvpPage";
import AdminRsvpFlow from "../pages/admin/AdminRsvpFlow";
import UploadPhotoPage from "../pages/admin/UploadToPhotoGallery";
import RsvpFlowPage from "../pages/rsvp/RsvpFlowPage";
import '../styles/App.css';

const theme = createTheme({
    palette: {
        // Map your custom color names to the palette.
        primary: {
            main: "#574c3f",       // used as "main-dark"
            dark: "#453e34",       // used as "hover-dark"
            contrastText: "#ece4da"// used as "main-light"
        },
        secondary: {
            main: "#ece4da",       // used as "hover-light"
            dark: "#d4c8ba",
            contrastText: "#574c3f"
        },
    },
    typography: {
        // Ensure you include the system fallback.
        fontFamily: '"EB Garamond", system-ui',
    },
    spacing: 8, // default spacing unit (8px)
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
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

                <Route path="/rsvp/*" element={<RsvpFlowPage />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
