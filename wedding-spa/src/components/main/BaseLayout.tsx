// components/main/BaseLayout.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Header from './headerComponents/Header';

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                p: 0,
                pb: 'env(safe-area-inset-bottom)',
            }}
        >
            <Box>
                <Header />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </Box>
        </Box>
    );
};

export default BaseLayout;
