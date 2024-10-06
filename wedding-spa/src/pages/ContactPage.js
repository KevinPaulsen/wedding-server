import React from 'react';
import BaseLayout from "../components/main/BaseLayout";
import Contact from "../components/main/Contact";

const Home = () => {
    return (
        <BaseLayout children={<Contact />}/>
    );
}


export default Home;