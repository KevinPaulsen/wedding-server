import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import PhotoGalleryComponent from "../../components/main/PhotoGalleryComponent";

const Home = () => {
    return (<BaseLayout children={<>
        <h1 className="text-center mb-3">Our Photo Gallery</h1>
        <PhotoGalleryComponent/>
    </>}/>);
}


export default Home;