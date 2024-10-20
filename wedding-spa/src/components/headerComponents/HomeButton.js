import React from 'react';
import {Button} from 'react-bootstrap';
import '../../styles/Header.css';
import {Link} from "react-router-dom";
import {AiOutlineHome} from 'react-icons/ai';

const HomeButton = () => {
    return (<Button as={Link} to="/" className="home-button">
                <AiOutlineHome/>
            </Button>);
}

export default HomeButton;