// components/main/BaseLayout.tsx
import React from 'react';
import Box from '@mui/material/Box';
import WeddingHeader, {HeaderLink} from './headerComponents/Header';
import Footer from "./headerComponents/Footer";
import Title from "./headerComponents/Title";

interface BaseLayoutProps {
    children: React.ReactNode;
}

const leftLinks: HeaderLink[] = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Details', to: '/details' },
];

const rightLinks: HeaderLink[] = [
  { label: 'Registry', to: '/registry' },
  { label: 'Our Story', to: '/story' },
];

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              py: 5,
              gap: 3
            }}
        >
          <WeddingHeader
              title="Kevin & Olivia"
              leftLinks={leftLinks}
              rightLinks={rightLinks}
              centerButton={true}
              mainDestination="/"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
    );
};

export default BaseLayout;
