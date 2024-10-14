import React from 'react';
import BaseLayout from "../components/main/BaseLayout";
import WeddingDetails from "../components/main/WeddingDetails";
import Schedule from "../components/main/Schedule";

const Home = () => {
    return (
        <BaseLayout children={<>
            <WeddingDetails/>
            <Schedule/>
        </>}/>
    );
}


export default Home;