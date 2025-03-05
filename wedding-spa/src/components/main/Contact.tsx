// components/main/Contact.tsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const Contact: React.FC = () => {
    return (
        <Container sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
                Contact
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }} className="story">
                Plz Don&apos;t...
            </Typography>
        </Container>
    );
};

export default Contact;
