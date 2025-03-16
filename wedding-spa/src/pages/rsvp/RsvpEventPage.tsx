// pages/rsvp/RsvpEventPage.tsx
import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FormData } from './RsvpFlowPage';
import CustomButton from '../../components/shared/CustomButton';

interface RsvpEventPageProps {
  eventKey: 'roce' | 'rehearsal' | 'ceremony' | 'reception';
  nextPage: (formData: FormData) => void;
  previousPage: (formData: FormData) => void;
  isLastEvent?: boolean;
}

const RsvpEventPage: React.FC<RsvpEventPageProps> = ({
                                                       eventKey,
                                                       nextPage,
                                                       previousPage,
                                                       isLastEvent,
                                                     }) => {
  // Use watch() to subscribe to form changes
  const { watch, setValue } = useFormContext<FormData>();
  const formData = watch();
  const eventData = formData[eventKey];
  const guestList = formData.guest_details || [];

  // We assume that only guests marked as "coming" in guest_details can attend.
  const comingGuestKeys = guestList
  .filter((g) => g.coming)
  .map((g) => g.id);

  const handleToggle = (guestId: string) => {
    const updated = eventData.guests_attending.includes(guestId)
        ? eventData.guests_attending.filter((id: string) => id !== guestId)
        : [...eventData.guests_attending, guestId];
    setValue(eventKey, { ...eventData, guests_attending: updated });
  };

  const handleSelectAllToggle = () => {
    const allSelected = comingGuestKeys.every((id) =>
        eventData.guests_attending.includes(id)
    );
    if (allSelected) {
      setValue(eventKey, { ...eventData, guests_attending: [] });
    } else {
      setValue(eventKey, { ...eventData, guests_attending: comingGuestKeys });
    }
  };

  const allSelected = comingGuestKeys.every((id) =>
      eventData.guests_attending.includes(id)
  );
  const numGuests = comingGuestKeys.length;
  const numComing = eventData.guests_attending.length;

  return (
      <Box sx={{ p: 3 }}>
        {!eventData.invited ? (
            <Typography>You have no invitation.</Typography>
        ) : (
            <>
              <FormControlLabel
                  control={
                    <Switch
                        checked={allSelected}
                        onChange={handleSelectAllToggle}
                        name="allComingSwitch"
                    />
                  }
                  label={`${numComing} / ${numGuests} Guests Attending`}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: 'EB Garamond, system-ui',
                      fontSize: '20px',
                    },
                  }}
              />
              <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2,
                    fontFamily: 'EB Garamond, system-ui',
                  }}
              >
                {comingGuestKeys.map((id) => {
                  const guest = guestList.find((g) => g.id === id);
                  if (!guest) return null;
                  const isAttending = eventData.guests_attending.includes(id);
                  return (
                      <CustomButton
                          key={id}
                          text={guest.display_name}
                          onClick={() => handleToggle(id)}
                          variant={isAttending ? 'dark' : 'light'}
                          height={50}
                          maxWidth={300}
                          marginBottom={1}
                      />
                  );
                })}
              </Box>
            </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 3 }}>
          <CustomButton
              text="Back"
              onClick={() => previousPage(formData)}
              variant="dark"
              width={75}
          />
          <CustomButton
              text={isLastEvent ? "Submit RSVP" : "Next"}
              onClick={() => nextPage(formData)}
              variant="dark"
              width="auto"
          />
        </Box>

      </Box>
  );
};

export default RsvpEventPage;
