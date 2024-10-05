import React from 'react';
import BaseLayout from "../components/home/BaseLayout";
import MainPhoto from "../components/home/MainPhoto";

const Home = () => {
    return (
        <BaseLayout children={<MainPhoto/>}/>
    );
}


export default Home;