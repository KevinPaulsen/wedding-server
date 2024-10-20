import React from 'react';
import '../../styles/Header.css';
import {Link} from "react-router-dom";

const Title = ({color, link = true}) => {
    return (link ? (<Link to="/" style={{textDecoration: 'none'}}>
                        <h1 className='title' style={{color}}>
                            Kevin & Olivia
                        </h1>
                    </Link>) : (<h1 className='title' style={{color}}>
                        Kevin & Olivia
                    </h1>));
}

export default Title;