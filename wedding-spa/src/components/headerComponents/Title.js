import React from 'react';
import '../../styles/Header.css';
import {Link} from "react-router-dom";

const Title = ({ color }) => {
    return (
        <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className='title' style={{ color }}>
                Kevin & Olivia
            </h1>
        </Link>
    );
}

export default Title;