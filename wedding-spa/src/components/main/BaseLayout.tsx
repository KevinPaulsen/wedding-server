// components/main/BaseLayout.tsx
import React from 'react';
import Box from '@mui/material/Box';
import WeddingHeader, {HeaderLink} from './headerComponents/Header';
import Footer from "./headerComponents/Footer";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const leftLinks: HeaderLink[] = [
  {label: 'Details', to: '/details'},
  {label: 'Gallery', to: '/gallery'},
  {label: 'Wedding Party', to: '/wedding-party'},
];

const rightLinks: HeaderLink[] = [
  {label: 'Registry', to: '/registry'},
  {label: 'Our Story', to: '/story'},
  {label: 'Things to Do', to: '/things-to-do'},
];

const BaseLayout: React.FC<BaseLayoutProps> = ({children}) => {
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
          homeIconDestination={'/'}
        />
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
          {children}
        </Box>
        <Box>
          <Footer/>
        </Box>
      </Box>
  );
};

export default BaseLayout;
