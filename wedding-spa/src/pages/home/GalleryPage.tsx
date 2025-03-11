// pages/home/GalleryPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import PhotoGalleryComponent from '../../components/main/PhotoGalleryComponent';

const GalleryPage: React.FC = () => {
  return (
      <BaseLayout>
        <PhotoGalleryComponent/>
      </BaseLayout>
  );
};

export default GalleryPage;
