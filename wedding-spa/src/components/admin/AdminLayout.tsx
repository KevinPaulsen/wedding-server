// components/admin/AdminLayout.tsx
import React from 'react';
import {Box} from '@mui/material';
import "../../styles/Header.css";
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
            p: 5,
            gap: 3,
          }}
      >
        <WeddingHeader
            title="Admin Page"
            leftLinks={leftLinks}
            centerButton={false}
            homeIconDestination={'/'}
            mainDestination="/admin/dashboard"
        />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
  );
};

export default AdminLayout;
