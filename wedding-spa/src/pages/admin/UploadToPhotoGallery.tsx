// pages/admin/UploadToPhotoGallery.tsx
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFileUploadComponent
  from '../../components/admin/adminGalleryControl/AdminFileUploadComponent';
import PhotoGalleryComponent from '../../components/main/PhotoGalleryComponent';

const UploadPhotoPage: React.FC = () => {
  return (
      <AdminLayout>
        <AdminFileUploadComponent/>
        <PhotoGalleryComponent makeDraggable/>
      </AdminLayout>
  );
};

export default UploadPhotoPage;
