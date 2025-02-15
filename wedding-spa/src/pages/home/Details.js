import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import Timeline from "../../components/main/timeline/Timeline";

const Home = () => {
    return (<BaseLayout children={<>
        <Timeline/>
    </>}/>);
}


export default Home;