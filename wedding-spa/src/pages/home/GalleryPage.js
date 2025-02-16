import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import PhotoGalleryComponent from "../../components/main/PhotoGalleryComponent";

const Home = () => {
    return (<BaseLayout children={<PhotoGalleryComponent/>}/>);
}


export default Home;