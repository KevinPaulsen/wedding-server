// components/admin/AdminLayout.tsx
import React from 'react';
import {Box} from '@mui/material';
import WeddingHeader, {HeaderLink} from "../main/headerComponents/Header";
import Footer from "../main/headerComponents/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const leftLinks: HeaderLink[] = [
  {label: 'Guests', to: '/admin/guests'},
  {label: "RSVP Information", to: '/admin/dashboard'},
  {label: 'Gallery', to: '/admin/add-photos'},
];

const AdminLayout: React.FC<AdminLayoutProps> = ({children}) => {
  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            py: 5,
            gap: 3,
          }}
      >
        <WeddingHeader
            title="Admin Page"
            leftLinks={leftLinks}
            homeIconDestination={'/'}
            mainDestination="/admin/dashboard"
        />

        {/* Add optional metadata component */}

        {/* Main Content */}
        <Box sx={{
          width: "100%",
          maxWidth: "100%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 1,
        }}>
          {children}
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
  );
};

export default AdminLayout;
