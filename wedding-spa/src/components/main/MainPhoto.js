import React from 'react';
import {Container, Image} from 'react-bootstrap';
import '../../styles/MainPhoto.css'

const MainPhoto = () => {
    return (
        <Container className="position-relative p-0">
            <Image src="/assets/mainCoupleImage.jpeg" alt="Main Image"
                   className="main-image position-absolute w-100 h-100"/>
            <h3 className="date-text position-absolute w-100 h-100 justify-content-center align-items-center">
                09 . 13. 2025
            </h3>
        </Container>
    );
};

export default MainPhoto;