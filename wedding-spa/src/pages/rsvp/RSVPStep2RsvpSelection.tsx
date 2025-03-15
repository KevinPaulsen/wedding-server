import React, { useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import { Rsvp } from '../../types/rsvp';
import { FormData } from './RsvpFlowPage';

interface RsvpSelectionStepProps {
  lookupResults: Rsvp[];
  onNext: (selected: Rsvp) => void;
  onBack: () => void;
}

const RsvpSelectionStep: React.FC<RsvpSelectionStepProps> = ({ lookupResults, onNext, onBack }) => {
  const { setValue } = useFormContext<FormData>();
  const [selectedId, setSelectedId] = useState<string>('');

  const handleSelect = (rsvp: Rsvp) => {
    setSelectedId(rsvp.rsvp_id);
  };

  const handleNext = () => {
    const selectedRsvp = lookupResults.find((rsvp) => rsvp.rsvp_id === selectedId);
    if (selectedRsvp) {
      // Auto-populate form with selected RSVP data.
      setValue('selectedRsvpId', selectedRsvp.rsvp_id);
      setValue('primary_contact_name', selectedRsvp.primary_contact.name);
      setValue('primary_contact_email', selectedRsvp.primary_contact.email);
      setValue('primary_contact_phone', selectedRsvp.primary_contact.phone_number);
      setValue('primary_contact_address', selectedRsvp.primary_contact.address);
      // Set default event attendance fields.
      setValue('rehearsal_attendance', selectedRsvp.rehearsal.guests_attending);
      setValue('ceremony_attendance', selectedRsvp.ceremony.guests_attending);
      setValue('reception_attendance', selectedRsvp.reception.guests_attending);
      setValue('roce_attendance', selectedRsvp.roce.guests_attending);
      onNext(selectedRsvp);
    }
  };

  return (
      <StepLayout
          title="Select Your RSVP Record"
          description="Multiple records were found. Please select the correct one."
      >
        <Box textAlign="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            {lookupResults.map((rsvp) => {
              const guestDisplayName =
                  rsvp.guest_list[rsvp.primary_contact.name]?.display_name ||
                  rsvp.primary_contact.name;
              const guestNames = Object.values(rsvp.guest_list)
              .map((g) => g.display_name)
              .join(', ');
              const isSelected = selectedId === rsvp.rsvp_id;
              return (
                  <Card
                      key={rsvp.rsvp_id}
                      onClick={() => handleSelect(rsvp)}
                      sx={{
                        width: 300,
                        mb: 2,
                        cursor: 'pointer',
                        border: isSelected ? '2px solid blue' : '1px solid grey',
                      }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                          {guestDisplayName}
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                          Guests: {guestNames}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
              );
            })}
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={!selectedId}>
              Next
            </Button>
          </Box>
        </Box>
      </StepLayout>
  );
};

export default RsvpSelectionStep;
