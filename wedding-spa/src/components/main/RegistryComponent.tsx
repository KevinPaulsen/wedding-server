// components/main/RegistryComponent.tsx
import React from 'react';
import {Container} from '@mui/material';
import ExpressCheckoutModal from "./ExpressCheckoutModal";

const RegistryComponent: React.FC = () => {
    return (
        <Container sx={{ textAlign: 'center' }}>
            <ExpressCheckoutModal />
        </Container>
    );
};

export default RegistryComponent;
