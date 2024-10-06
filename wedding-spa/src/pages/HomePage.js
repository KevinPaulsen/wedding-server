import React from 'react';
import BaseLayout from "../components/main/BaseLayout";
import MainPhoto from "../components/main/MainPhoto";

const HomePage = () => {
    return (
        <BaseLayout children={<MainPhoto/>}/>
    );
}


export default HomePage;