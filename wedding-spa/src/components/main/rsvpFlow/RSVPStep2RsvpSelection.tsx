// components/main/rsvpFlow/RSVPStep2RsvpSelection.tsx
import React, {useState} from 'react';
import {Box, Card, CardActionArea, CardContent, Typography} from '@mui/material';
import {useFormContext} from 'react-hook-form';
import StepLayout from './RSVPStepLayout';
import {Rsvp} from '../../../types/rsvp';
import {FormData} from '../../../pages/rsvp/RsvpFlowPage';

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
      // Set default event attendance fields using the new EventData structure.
      setValue('rehearsal', {
        invited: selectedRsvp.rehearsal.invited,
        guests_attending: selectedRsvp.rehearsal.guests_attending,
      });
      setValue('ceremony', {
        invited: selectedRsvp.ceremony.invited,
        guests_attending: selectedRsvp.ceremony.guests_attending,
      });
      setValue('reception', {
        invited: selectedRsvp.reception.invited,
        guests_attending: selectedRsvp.reception.guests_attending,
      });
      setValue('roce', {
        invited: selectedRsvp.roce.invited,
        guests_attending: selectedRsvp.roce.guests_attending,
      });
      onNext(selectedRsvp);
    }
  };

  return (
      <StepLayout
          title="Select Your RSVP Record"
          description="Multiple RSVPs were found under this name. Please select the correct one."
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={!selectedId}
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
                      elevation={10}
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        mb: 2,
                        cursor: 'pointer',
                        border: '2px solid',
                        bgcolor: (theme) => isSelected ? theme.palette.secondary.dark : theme.palette.secondary.main,
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
        </Box>
      </StepLayout>
  );
};

export default RsvpSelectionStep;
