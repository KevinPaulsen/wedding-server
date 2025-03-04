// GalleryPage.tsx
import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import PhotoGalleryComponent from "../../components/main/PhotoGalleryComponent";

const GalleryPage: React.FC = () => {
    return (
        <BaseLayout>
            <h1 className="text-center mb-3">Our Photo Gallery</h1>
            <PhotoGalleryComponent/>
        </BaseLayout>
    );
};

export default GalleryPage;
