import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const DetailsComponent = () => {
  return (
      <Paper
          elevation={3}
          sx={{
            p: 4,
            mx: 'auto',
            maxWidth: 600,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'secondary.light',
          }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Wedding Details
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            RSVP Deadline
          </Typography>
          <Typography variant="body1">Please respond by July 1, 2025.</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Dress Code
          </Typography>
          <Typography variant="body1">
            Formal attire is requested. All wedding events will be held indoors, but please keep in mind that Seattle Septembers can be cool and rainy, so dress accordingly.
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Additional Guests
          </Typography>
          <Typography variant="body1">
            Due to space constraints, we are unable to accept additional guests including plus ones and other family members. We kindly ask that only those included in the invitation be in attendance.
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Food Allergy or Diet Restrictions
          </Typography>
          <Typography variant="body1">
            Please provide details of any food allergies or dietary restrictions in your RSVP. We are happy to accommodate you!
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Parking
          </Typography>
          <Typography variant="body1">
            {/* You can add parking details here */}
            Parking details will be provided.
          </Typography>
        </Box>
      </Paper>
  );
};

export default DetailsComponent;
