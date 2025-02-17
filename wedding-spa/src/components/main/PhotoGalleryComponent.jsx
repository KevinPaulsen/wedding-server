// PhotoGalleryComponent.jsx
import React, {useState} from "react";
import {RowsPhotoAlbum} from "react-photo-album";
import {ColumnsPhotoAlbum} from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import useGetPhotoMetadata from "../../hooks/useGetPhotoMetadata";
import {Container, Row} from "react-bootstrap";
import SortableGallery from "../SortableGallery/SortableGallery";
import {arrayMove} from "@dnd-kit/sortable";
import {useChangeImageOrder} from "../../hooks/useChangeImageOrder";

const PhotoGalleryComponent = ({ makeDraggable = false }) => {
    const [index, setIndex] = useState(-1);
    const { data, setData, loading, error } = useGetPhotoMetadata();
    const { changeImageOrder } = useChangeImageOrder();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || data.length === 0) return <div>No photos available.</div>;

    const handleMovePhoto = (oldIndex, newIndex) => {
        if (oldIndex === newIndex) {
            return;
        }

        const movingImageId = data[oldIndex].imageId;
        let previousImageId;
        let followingImageId;

        if (oldIndex < newIndex) {
            previousImageId = data[newIndex].imageId;
            followingImageId = newIndex >= data.length - 1 ? null : data[newIndex + 1].imageId;
        } else {
            previousImageId = newIndex <= 0 ? null : data[newIndex - 1].imageId;
            followingImageId = data[newIndex].imageId;
        }

        // Call the API with the IDs.
        changeImageOrder(movingImageId, previousImageId, followingImageId);

        // Update the local photo order
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

    return (
            <Container>
                <Row className="justify-content-center mb-5">
                    <div className="col-12 col-md-10 col-lg-8">
                        {makeDraggable ? (
                        <SortableGallery
                                gallery={RowsPhotoAlbum}
                                photos={data}
                                movePhoto={handleMovePhoto}
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

                {!makeDraggable && <Lightbox
                        slides={data}
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                        // Only include the plugins you need:
                        plugins={[Thumbnails, Zoom]}
                />}
            </Container>
    );
};

export default PhotoGalleryComponent;
