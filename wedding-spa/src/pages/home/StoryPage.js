import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import Story from "../../components/main/Story";

const Home = () => {
    return (
        <BaseLayout children={<Story/>}/>
    );
}


export default Home;