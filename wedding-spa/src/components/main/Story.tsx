// components/main/Story.tsx
import React from 'react';
import {Box, Container, Typography} from '@mui/material';

const Story: React.FC = () => {
  return (
      <Container sx={{textAlign: 'center'}}>
        <Typography variant="body1" sx={{mb: 3}} className="story">
          Legend says that Kevin Loves Olivia. Some have even said that Olivia loves Kevin back.
          But Kevin at least made a website for her.
        </Typography>
        <Box
            component="img"
            src="/assets/Story.jpg"
            alt="Story Image"
            sx={{maxWidth: 200, mx: 'auto'}}
            className="gallery-image"
        />
      </Container>
  );
};

export default Story;
