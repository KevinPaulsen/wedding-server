// components/shared/NotFound.tsx
import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Container, Typography} from '@mui/material';

const NotFound: React.FC = () => {
  return (
      <Container sx={{textAlign: 'center', mt: 5}}>
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you’re looking for doesn’t exist.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go Home
        </Button>
      </Container>
  );
};

export default NotFound;
