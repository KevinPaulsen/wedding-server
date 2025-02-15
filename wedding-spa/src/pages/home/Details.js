import React from 'react';
import BaseLayout from "../../components/main/BaseLayout";
import Timeline from "../../components/main/timeline/Timeline";

const Home = () => {
    return (<BaseLayout children={<>
        <h1 className="text-center mb-3">Wedding Details</h1>
        <Timeline/>
    </>}/>);
}


export default Home;