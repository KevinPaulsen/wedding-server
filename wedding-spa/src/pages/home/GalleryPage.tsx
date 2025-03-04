// src/pages/home/GalleryPage.tsx
import React from 'react';
import { Typography } from '@mui/material';
import BaseLayout from '../../components/main/BaseLayout';
import PhotoGalleryComponent from '../../components/main/PhotoGalleryComponent';

const GalleryPage: React.FC = () => {
    return (
        <BaseLayout>
            <div>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ mb: 3 }}
                >
                    Our Photo Gallery
                </Typography>
                <PhotoGalleryComponent />
            </div>
        </BaseLayout>
    );
};

export default GalleryPage;
