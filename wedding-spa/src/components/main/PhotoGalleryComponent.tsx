// components/main/PhotoGalleryComponent.tsx
import React, { useState } from 'react';
import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import useGetPhotoMetadata, { PhotoMetadata } from '../../hooks/gallery/useGetPhotoMetadata';
import { Container, Grid2, Box, Typography, CircularProgress } from '@mui/material';
import SortableGallery from '../shared/SortableGallery/SortableGallery';
import { arrayMove } from '@dnd-kit/sortable';
import { useChangeImageOrder } from '../../hooks/gallery/useChangeImageOrder';
import { useDeleteImage } from '../../hooks/gallery/useDeleteImage';

const PhotoGalleryComponent: React.FC<{ makeDraggable?: boolean }> = ({ makeDraggable = false }) => {
  const [index, setIndex] = useState<number>(-1);
  const { data, setData, loading, error } = useGetPhotoMetadata();
  const { execute: changeImageOrder } = useChangeImageOrder();
  const { execute: deleteImage } = useDeleteImage();

  const handleMovePhoto = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const movingImageId = data[oldIndex].imageId;
    let previousImageId: string | null;
    let followingImageId: string | null;

    if (oldIndex < newIndex) {
      previousImageId = data[newIndex].imageId;
      followingImageId = newIndex >= data.length - 1 ? null : data[newIndex + 1].imageId;
    } else {
      previousImageId = newIndex <= 0 ? null : data[newIndex - 1].imageId;
      followingImageId = data[newIndex].imageId;
    }

    changeImageOrder(movingImageId, previousImageId, followingImageId);
    const newData = arrayMove(data, oldIndex, newIndex);
    setData(newData);
  };

  const commonComponentsProps = () => ({
    image: {
      style: {
        border: '2px solid var(--main-dark)',
        padding: '1px',
      },
    },
  });

  const handleDelete = (photo: PhotoMetadata, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    deleteImage(photo.imageId);
    setData((prevData) => prevData.filter((item: PhotoMetadata) => item.imageId !== photo.imageId));
  };

  return (
      <Container sx={{ minHeight: '100vh', py: 4 }}>
        {loading && (
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50vh',
                }}
            >
              <CircularProgress color="primary" size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading Photos...
              </Typography>
            </Box>
        )}

        {!loading && error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="h6" color="error">
                Error: {error}
              </Typography>
            </Box>
        )}

        {!loading && !error && (!data || data.length === 0) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="h6">No photos available.</Typography>
            </Box>
        )}

        {!loading && !error && data && data.length > 0 && (
            <>
              <Grid2
                  container
                  justifyContent="center"
                  sx={{ mb: 5, width: '100%', flexDirection: 'column' }}
              >
                {makeDraggable ? (
                    <SortableGallery
                        gallery={RowsPhotoAlbum}
                        photos={data}
                        movePhoto={handleMovePhoto}
                        handleDelete={handleDelete}
                        componentsProps={commonComponentsProps}
                        targetRowHeight={175}
                    />
                ) : (
                    <RowsPhotoAlbum
                        photos={data}
                        targetRowHeight={175}
                        onClick={({ index }) => setIndex(index)}
                        componentsProps={commonComponentsProps}
                    />
                )}
              </Grid2>
              {!makeDraggable && (
                  <Lightbox
                      slides={data}
                      open={index >= 0}
                      index={index}
                      close={() => setIndex(-1)}
                      plugins={[Thumbnails, Zoom]}
                  />
              )}
            </>
        )}
      </Container>
  );
};

export default PhotoGalleryComponent;
