// app/App.tsx
import React, {lazy, Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AdminLogin from '../components/admin/AdminLogin';
import PrivateRoute from '../routes/PrivateRoute';
import NotFound from '../components/shared/NotFound';
import HomePage from '../pages/home/HomePage';
import StoryPage from '../pages/home/StoryPage';
import Contact from '../pages/home/ContactPage';
import Details from '../pages/home/Details';
import Gallery from '../pages/home/GalleryPage';
import AdminMain from '../pages/admin/AdminRsvpInfoPage';
import GuestListPage from '../pages/admin/GuestListPage';
import UploadPhotoPage from '../pages/admin/UploadToPhotoGallery';
import RsvpFlowPage from '../pages/rsvp/RsvpFlowPage';
import '../styles/App.css';
import RegistryPage from "../pages/home/RegistryPage";
import PaymentConfirmationPage from "../pages/home/PaymentConfirmationPage";
import ThingsToDoPage from "../pages/home/ThingsToDoPage";
import WeddingPartyPage from "../pages/home/WeddingPartyPage";
import '../styles/App.css';
import {AdminDataProvider} from "../context/AdminDataContext";
import {LoadingIcon} from "yet-another-react-lightbox";

// Define your color constants
const primaryMainDark = '#574c3f';
const primaryLightDark = '#b0643f';
const primaryDarkDark = '#453e34';

const secondaryMainLight = '#ece4da';
const secondaryLightLight = '#d4c8ba';
const secondaryDarkLight = '#c6b7a7';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMainDark,
      light: primaryLightDark,
      dark: primaryDarkDark,
      contrastText: secondaryMainLight,
    },
    secondary: {
      main: secondaryMainLight,
      light: secondaryLightLight,
      dark: secondaryDarkLight,
      contrastText: primaryMainDark,
    },
    background: {
      default: secondaryMainLight,
      paper: secondaryMainLight,
    },
    text: {
      primary: primaryMainDark,
      secondary: primaryLightDark,
    },
    divider: primaryLightDark,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 750,
      lg: 1000,
      xl: 1200,
    },
  },
  typography: {
    fontFamily: '"EB Garamond"',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  spacing: 8, // Base spacing unit (8px)
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        clickable: {
          '&:hover, &:focus': {
            backgroundColor: secondaryLightLight,
          },
        },
        deleteIcon: {
          color: primaryMainDark,
          '&:hover': {
            color: secondaryDarkLight,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: 2, // Thicker border
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: primaryMainDark,
          '&.Mui-checked': {
            color: primaryMainDark,
            '& + .MuiSwitch-track': {
              backgroundColor: primaryMainDark,
            },
          },
        },
        track: {
          backgroundColor: primaryMainDark,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.menu-link': {
          textDecoration: 'none',
          color: 'inherit',
          fontSize: '1.25rem',
          position: 'relative',
          paddingBottom: 4,
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: primaryLightDark,
            bottom: 3,
            left: 0,
            opacity: 0,
          },
          // When the link is active, show the underline.
          '&.active:after': {
            opacity: 1,
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
      <ThemeProvider theme={theme}>
        <Suspense fallback={<LoadingIcon />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/details" element={<Details />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/registry" element={<RegistryPage />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/things-to-do" element={<ThingsToDoPage />} />
            <Route path="/wedding-party" element={<WeddingPartyPage />} />
            <Route path="/rsvp/*" element={<RsvpFlowPage />} />

            {/* Admin Login */}
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Grouped Admin Routes */}
            <Route
                path="/admin/*"
                element={
                  <PrivateRoute component={
                    <AdminDataProvider>
                      <Routes>
                        <Route path="login" element={<AdminLogin />} />
                        <Route path="dashboard" element={<AdminMain />} />
                        <Route path="guests" element={<GuestListPage />} />
                        <Route path="add-photos" element={<UploadPhotoPage />} />
                        {/* You can add more admin routes here */}
                      </Routes>
                    </AdminDataProvider>
                  } />
                }
            />

            {/* Catch-all NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
  );
};

export default App;
