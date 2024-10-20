import React from 'react';
import {Container, Image} from 'react-bootstrap';
import '../../styles/StoryContent.css'

const Story = () => {
    return (<Container className='text-center'>
                <h1 className="text-center mb-3">Our Story</h1>
                <body className='story text-center mb-3'>
                Legend says that Kevin Loves Olivia. Some have even said that Olivia loves Kevin back.
                But Kevin at least made a website for her.
                </body>
                <Image src="/assets/Story.jpg" alt="Story Image" className="max-image"/>
            </Container>);
}

export default Story;