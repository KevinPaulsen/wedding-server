// components/main/RegistryComponent.tsx
import React from 'react';
import {Container, Typography} from '@mui/material';
import ExpressCheckoutModal from "./ExpressCheckoutModal";

const RegistryComponent: React.FC = () => {
    return (
        <Container sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
                Registry
            </Typography>
            <ExpressCheckoutModal />
        </Container>
    );
};

export default RegistryComponent;
