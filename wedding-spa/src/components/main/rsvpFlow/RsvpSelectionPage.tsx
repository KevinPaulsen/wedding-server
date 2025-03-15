// components/main/rsvpFlow/RsvpSelectionPage.tsx
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { useFlow } from '../../../context/FlowProvider';
import { Rsvp } from "../../../types/rsvp";
import CustomButton from "../../shared/CustomButton";

interface RsvpSelectionPageProps {
  nextPage: (rsvp: Rsvp) => void;
  previousPage: (rsvp: Rsvp) => void;
  requireAnswers: boolean;
  returnPage?: string | null;
}

const RsvpSelectionPage: React.FC<RsvpSelectionPageProps> = ({ nextPage, previousPage }) => {
  const { lookupResults, setFormData, formData } = useFlow();
  const [selectedRsvpId, setSelectedRsvpId] = useState<string | null>(null);

  if (!lookupResults || lookupResults.length === 0) {
    return (
        <Box sx={{ p: 3 }}>
          <Typography>No RSVP records found.</Typography>
        </Box>
    );
  }

  const handleCardClick = (rsvpId: string) => {
    setSelectedRsvpId(rsvpId);
  };

  const handleNext = () => {
    if (!selectedRsvpId) return;
    const selectedRsvp = lookupResults.find(rsvp => rsvp.rsvp_id === selectedRsvpId);
    if (selectedRsvp) {
      setFormData(selectedRsvp);
      nextPage(selectedRsvp);
    }
  };

  const renderRsvpCard = (rsvp: Rsvp) => {
    const guestNames = Object.values(rsvp.guest_list)
    .map(guest => guest.display_name)
    .join(', ');
    const isSelected = selectedRsvpId === rsvp.rsvp_id;
    return (
        <Card
            key={rsvp.rsvp_id}
            sx={(theme) => ({
              width: "300px",
              mb: 2,
              cursor: 'pointer',
              border: `2px solid ${theme.palette.secondary.contrastText}`,
              bgcolor: isSelected ? theme.palette.primary.main : theme.palette.secondary.dark,
              borderRadius: theme.shape.borderRadius,
            })}
            onClick={() => handleCardClick(rsvp.rsvp_id)}
        >
          <CardActionArea>
            <CardContent>
              <Typography
                  variant="h6"
                  sx={(theme) => ({
                    color: isSelected ? theme.palette.secondary.main : theme.palette.primary.main,
                  })}
              >
                {rsvp.guest_list[rsvp.primary_contact.name].display_name}
              </Typography>
              <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color: isSelected ? theme.palette.secondary.main : theme.palette.primary.main,
                  })}
              >
                Guests: {guestNames}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    );
  };

  return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {lookupResults.map(rsvp => renderRsvpCard(rsvp))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 4 }}>
          <CustomButton text="Back" onClick={() => previousPage(formData)} variant="dark" width="75px" />
          <CustomButton text="Next" onClick={handleNext} variant="dark" width="75px" />
        </Box>
      </Box>
  );
};

export default RsvpSelectionPage;
