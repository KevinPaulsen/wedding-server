import React from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { Container, Row } from "react-bootstrap";
import { arrayMove } from "@dnd-kit/sortable";

import useGetPhotoMetadata from "../../../hooks/useGetPhotoMetadata";
import SortableGallery from "../../SortableGallery/SortableGallery";
import { useChangeImageOrder } from "../../../hooks/useChangeImageOrder"; // adjust path if needed

const AdminGalleryComponent = () => {
    const { data, setData, loading, error } = useGetPhotoMetadata();
    const { changeImageOrder } = useChangeImageOrder();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || data.length === 0) return <div>No photos available.</div>;

    const handleMovePhoto = (oldIndex, newIndex) => {
        const movingImageId = data[oldIndex].imageId;
        const previousImageId = newIndex <= 0 ? null : data[newIndex - 1].imageId;
        const followingImageId = data[newIndex].imageId;

        // Call the API with the IDs.
        changeImageOrder(movingImageId, previousImageId, followingImageId);

        // Update the local photo order
        const newData = arrayMove(data, oldIndex, newIndex);
        setData(newData);
    };

    return (
            <Container>
                <Row className="justify-content-center mb-5">
                    <div className="col-12 col-md-10 col-lg-8">
                        <SortableGallery
                                gallery={RowsPhotoAlbum}
                                spacing={15}
                                photos={data}
                                movePhoto={handleMovePhoto}
                        />
                    </div>
                </Row>
            </Container>
    );
};

export default AdminGalleryComponent;
