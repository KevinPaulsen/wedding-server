// PhotoGalleryComponent.jsx
import React, { useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import useGetPhotoMetadata from "../../hooks/useGetPhotoMetadata";
import { Container, Row } from "react-bootstrap";

const PhotoGalleryComponent = () => {
    const [index, setIndex] = useState(-1);
    const { data, loading, error } = useGetPhotoMetadata();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || data.length === 0) return <div>No photos available.</div>;

    return (
            <Container>
                <Row className="justify-content-center mb-5">
                    <div className="col-12 col-md-10 col-lg-8">
                        <RowsPhotoAlbum
                                photos={data}
                                targetRowHeight={300}
                                onClick={({ index }) => setIndex(index)}
                                componentsProps={() => ({
                                    image: {
                                        style: {
                                            border: "3px solid var(--main-dark)", // set your border style here
                                            padding: "1px",           // optional: inner spacing
                                        },
                                    },
                                })}
                        />
                    </div>
                </Row>

                <Lightbox
                        slides={data}
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                        // Only include the plugins you need:
                        plugins={[Thumbnails, Zoom]}
                />
            </Container>
    );
};

export default PhotoGalleryComponent;
