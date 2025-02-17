import React from "react";
import "react-photo-album/rows.css";
import PhotoGalleryComponent from "../../main/PhotoGalleryComponent";

const AdminGalleryComponent = () => {
    return (<PhotoGalleryComponent makeDraggable={true} />);
};

export default AdminGalleryComponent;
