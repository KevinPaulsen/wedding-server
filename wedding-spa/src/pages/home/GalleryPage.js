import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import Gallery from "../../components/main/Gallery";

const Home = () => {
    return (
        <BaseLayout children={<Gallery/>}/>
    );
}


export default Home;