import React from 'react';
import BaseLayout from "../components/home/BaseLayout";
import WeddingDetails from "../components/home/WeddingDetails";
import Schedule from "../components/home/Schedule";

const Home = () => {
    return (
        <BaseLayout children={<>
            <WeddingDetails />
            <Schedule />
        </>}/>
    );
}


export default Home;