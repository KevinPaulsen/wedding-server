// components/main/DetailsComponent.tsx
import React from 'react';
import { Box, Typography, Paper, Divider, Link } from '@mui/material';

const detailsData = [
  {
    title: 'Ceremony 12:30 PM',
    content: 'Blessed Sacrament Church',
    address: '5050 8th Ave NE, Seattle, WA 98105',
  },
  {
    title: 'Holy Hour 3:00 PM',
    content: 'Prince of Peace Newman Center',
    address: '4502 20th Ave NE, Seattle, WA 98105',
  },
  {
    title: 'Reception 5:30 PM',
    content: 'Pickering Barn',
    address: '1730 10th Ave NW, Issaquah, WA 98027',
  },
  {
    title: 'RSVP Deadline',
    content: 'Please respond by June 15, 2025.',
  },
  {
    title: 'Dress Code',
    content:
        'Formal attire is requested. All wedding events will be held indoors, but please keep in mind that Seattle Septembers can be cool and rainy, so dress accordingly.',
  },
  {
    title: 'Additional Guests',
    content:
        'Due to space constraints, we are unable to accept additional guests including plus ones and other family members. We kindly ask that only those included in the invitation be in attendance.',
  },
  {
    title: 'Food Allergy or Diet Restrictions',
    content:
        'Please provide details of any food allergies or dietary restrictions in your RSVP. We are happy to accommodate you!',
  },
  {
    title: 'Parking',
    content: 'Parking details will be provided.',
  },
];

// Helper function to determine the best map link based on device.
const getMapLink = (address: string) => {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    // Check if the device is mobile by looking for "Mobi" or "Android" or iOS identifiers.
    const isMobile = /Mobi|Android|iPad|iPhone|iPod/.test(userAgent);
    if (isMobile) {
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      if (isIOS) {
        // For iOS, use the Apple Maps URL scheme.
        return `maps://?q=${encodeURIComponent(address)}`;
      } else {
        // For Android and other mobile devices, use the geo: scheme.
        return `geo:0,0?q=${encodeURIComponent(address)}`;
      }
    }
  }
  // For non-mobile (e.g., desktop), fallback to a Google Maps HTTPS URL.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

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

        {detailsData.map((item) => (
            <Box key={item.title}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="body1">{item.content}</Typography>
              {item.address && (
                  <Typography variant="body2" color="primary">
                    <Link
                        href={getMapLink(item.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                    >
                      {item.address}
                    </Link>
                  </Typography>
              )}
            </Box>
        ))}
      </Paper>
  );
};

export default DetailsComponent;
