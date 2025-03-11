// components/main/PhotoGalleryComponent.tsx
import React, {useState} from 'react';
import {RowsPhotoAlbum} from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import useGetPhotoMetadata, {PhotoMetadata} from '../../hooks/gallery/useGetPhotoMetadata';
import {Container, Grid2} from '@mui/material';
import SortableGallery from '../shared/SortableGallery/SortableGallery';
import {arrayMove} from '@dnd-kit/sortable';
import {useChangeImageOrder} from '../../hooks/gallery/useChangeImageOrder';
import {useDeleteImage} from '../../hooks/gallery/useDeleteImage';

const PhotoGalleryComponent: React.FC<{ makeDraggable?: boolean }> = ({makeDraggable = false}) => {
  const [index, setIndex] = useState<number>(-1);
  const {data, setData, loading, error} = useGetPhotoMetadata();
  const {execute: changeImageOrder} = useChangeImageOrder();
  const {execute: deleteImage} = useDeleteImage();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>No photos available.</div>;

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
      <Container>
        <Grid2 container justifyContent="center"
               sx={{mb: 5, width: '100%', flexDirection: 'column'}}>
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
                  onClick={({index}) => setIndex(index)}
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
      </Container>
  );
};

export default PhotoGalleryComponent;
