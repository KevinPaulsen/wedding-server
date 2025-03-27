// components/admin/AdminLayout.tsx
import React from 'react';
import {Box} from '@mui/material';
import WeddingHeader, {HeaderLink} from '../main/headerComponents/Header';
import Footer from '../main/headerComponents/Footer';
import AdminStatsOverview, {StatsData} from './AdminStatsOverview';

interface AdminLayoutProps {
  children: React.ReactNode;
  // Make the stats prop optional
  stats?: StatsData;
}

// Links shown in the header
const leftLinks: HeaderLink[] = [
  { label: 'Guests', to: '/admin/guests' },
  { label: 'RSVP Information', to: '/admin/dashboard' },
  { label: 'Gallery', to: '/admin/add-photos' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, stats }) => {
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
            homeIconDestination="/"
            mainDestination="/admin/dashboard"
        />

        {/* Optional Stats Overview */}
        {stats && (
            <AdminStatsOverview stats={stats} />
        )}

        {/* Main Content */}
        <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              p: 1,
            }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box>
          <Footer />
        </Box>
      </Box>
  );
};

export default AdminLayout;
