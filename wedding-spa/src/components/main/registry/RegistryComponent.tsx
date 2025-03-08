import React, { useState } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import ExpressCheckoutDialog from "./ExpressCheckoutDialog";
import DonateCard from "./DonateCard";
import rome from "../../../assets/rome.jpg";
import furnishing from "../../../assets/furnishing.jpg";
import registry from "../../../assets/registry.jpg";

const RegistryComponent: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Function to open the Amazon Registry website in a new tab
  const openRegistrySite = () => {
    window.open("https://www.amazon.com/wedding/share/kevinolivia", "_blank", "noopener,noreferrer");
  };

  return (
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Amazon Registry
        </Typography>
        <Box
            sx={{
              height: "3px",
              width: '40%',
              bgcolor: 'primary.light',
              mx: 'auto',
              mb: 4,
            }}
        />

        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap'
            }}
        >
          <DonateCard
              image={registry}
              title="Amazon Registry"
              description="Visit our Amazon Registry for more details!"
              buttonText="Link To Registry"
              onButtonClick={openRegistrySite}
          />
        </Box>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mt: 5 }}>
          Cash Gift
        </Typography>
        <Box
            sx={{
              height: "3px",
              width: '40%',
              bgcolor: 'primary.light',
              mx: 'auto',
              mb: 4,
            }}
        />

        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap',
              mb: 5
            }}
        >
          <DonateCard
              image={rome}
              title="Honeymoon Fund"
              description="Donate what you wish."
              buttonText="Donate"
              onButtonClick={handleOpen}
              showVenmo
          />
          <DonateCard
              image={furnishing}
              title="Furnishing Our Home"
              description="Donate what you wish."
              buttonText="Donate"
              onButtonClick={handleOpen}
              showVenmo
          />
        </Box>

        <ExpressCheckoutDialog open={open} onClose={handleClose} />
      </Container>
  );
};

export default RegistryComponent;
