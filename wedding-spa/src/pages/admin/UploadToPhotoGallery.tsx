// pages/admin/UploadToPhotoGallery.tsx
import React, {useState} from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFileUploadComponent
  from '../../components/admin/adminGalleryControl/AdminFileUploadComponent';
import PhotoGalleryComponent from '../../components/main/PhotoGalleryComponent';
import {Box, Slider, Typography} from '@mui/material';

const UploadPhotoPage: React.FC = () => {
  const [rowHeight, setRowHeight] = useState(175);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setRowHeight(newValue as number);
  };

  return (
      <AdminLayout>
        <AdminFileUploadComponent />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">
            Target Row Height: {rowHeight}px
          </Typography>
          <Slider
              value={rowHeight}
              onChange={handleSliderChange}
              aria-labelledby="target-row-height-slider"
              min={50}
              max={500}
              valueLabelDisplay="auto"
              sx={{ width: 300 }}
          />
        </Box>

        <PhotoGalleryComponent targetRowHeight={rowHeight} makeDraggable />
      </AdminLayout>
  );
};

export default UploadPhotoPage;
