// PhotoGalleryComponent.jsx
import React, { useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import useGetPhotoMetadata from "../../hooks/gallery/useGetPhotoMetadata";
import { Container, Row } from "react-bootstrap";
import SortableGallery from "../shared/SortableGallery/SortableGallery";
import { arrayMove } from "@dnd-kit/sortable";
import { useChangeImageOrder } from "../../hooks/gallery/useChangeImageOrder";
import { useDeleteImage } from "../../hooks/gallery/useDeleteImage";

const PhotoGalleryComponent: React.FC<{ makeDraggable?: boolean }> = ({ makeDraggable = false }) => {
    const [index, setIndex] = useState<number>(-1);

    // Our generic hook returns { data, setData, loading, error }
    const { data, setData, loading, error } = useGetPhotoMetadata();

    // Get the execute functions from the specialized hooks.
    const { execute: changeImageOrder } = useChangeImageOrder();
    const { execute: deleteImage } = useDeleteImage();

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

        // Update image order using the generic hook
        changeImageOrder(movingImageId, previousImageId, followingImageId);

        // Locally update the photo order
        const newData = arrayMove(data, oldIndex, newIndex);
        setData(newData);
    };

    const commonComponentsProps = () => ({
        image: {
            style: {
                border: "3px solid var(--main-dark)",
                padding: "1px",
            },
        },
    });

    const handleDelete = (photo: any, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        // Call the generic deleteImage function
        deleteImage(photo.imageId);
        setData(prevData => prevData.filter((item: any) => item.imageId !== photo.imageId));
    };

    return (
        <Container>
            <Row className="justify-content-center mb-5">
                <div className="col-12 col-md-10 col-lg-8">
                    {makeDraggable ? (
                        <SortableGallery
                            gallery={RowsPhotoAlbum}
                            photos={data}
                            movePhoto={handleMovePhoto}
                            handleDelete={handleDelete}
                            componentsProps={commonComponentsProps}
                            targetRowHeight={300}
                        />
                    ) : (
                        <RowsPhotoAlbum
                            photos={data}
                            targetRowHeight={300}
                            onClick={({ index }) => setIndex(index)}
                            componentsProps={commonComponentsProps}
                        />
                    )}
                </div>
            </Row>
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
