// app/App.tsx
import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AdminLogin from '../components/admin/AdminLogin';
import PrivateRoute from '../routes/PrivateRoute';
import NotFound from '../components/shared/NotFound';
import HomePage from '../pages/home/HomePage';
import Story from '../pages/home/StoryPage';
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

// Define your color constants
const primaryMainDark = '#574c3f';
const primaryLightDark = '#b0643f';
const primaryDarkDark = '#453e34';

const secondaryMainLight = '#ece4da';
const secondaryLightLight = '#d4c8ba';
const secondaryDarkLight = '#c6b7a7';

// Create the theme using the variables
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
        <Routes>
          {/* Login page/redirects */}
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/login" element={<Navigate to="/admin/login" replace/>}/>
          <Route path="/admin" element={<Navigate to="/admin/login" replace/>}/>

          {/* Dashboard Page/redirects */}
          <Route path="/admin/dashboard" element={<PrivateRoute component={<AdminMain/>}/>}/>
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace/>}/>

          <Route path="/admin/guests" element={<PrivateRoute component={<GuestListPage/>}/>}/>
          <Route path="/admin/add-photos" element={<PrivateRoute component={<UploadPhotoPage/>}/>}/>

          <Route path="/" element={<HomePage/>}/>
          <Route path="/gallery" element={<Gallery/>}/>
          <Route path="/details" element={<Details/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/registry" element={<RegistryPage/>}/>
          <Route path="/payment-confirmation" element={<PaymentConfirmationPage/>}/>
          <Route path="/story" element={<Story/>}/>

          <Route path="/rsvp/*" element={<RsvpFlowPage/>}/>

          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </ThemeProvider>
  );
};

export default App;
