import React from 'react';
import {Container, Image} from 'react-bootstrap';
import '../../styles/Gallery.css'

const Gallery = () => {
    return (<Container fluid className='text-center'>
                <h1 className="text-center mb-3">Gallery</h1>
                <Image src="/assets/Gallery.jpg" alt="Story Image" className="gallery-image mb-3"/>
                <body className='info-text text-center mb-3'>
                Wedding photos to come soon!
                <p/>
                Send us your photos!
                </body>
            </Container>)
}

export default Gallery;
