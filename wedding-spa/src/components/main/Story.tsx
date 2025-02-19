// Story.js
import React from 'react';
import { Container, Image } from 'react-bootstrap';
import '../../styles/StoryContent.css';

const Story: React.FC = () => {
    return (
        <Container className="text-center">
            <h1 className="text-center mb-3">Our Story</h1>
            <div className="story text-center mb-3">
                Legend says that Kevin Loves Olivia. Some have even said that Olivia loves Kevin back.
                But Kevin at least made a website for her.
            </div>
            <Image src="/assets/Story.jpg" alt="Story Image" className="gallery-image" />
        </Container>
    );
};

export default Story;
