// components/main/rsvpFlow/RsvpEvents.tsx
import React from 'react';
import {Box, CircularProgress, FormControlLabel, Switch, Typography} from '@mui/material';
import {useFormContext} from 'react-hook-form';
import {FormData} from '../../../pages/rsvp/RsvpFlowPage';
import CustomButton from '../../shared/CustomButton';
import StepLayout from "./RSVPStepLayout";

interface RsvpEventPageProps {
  eventKey: 'roce' | 'rehearsal' | 'ceremony' | 'reception';
  title: string;
  time: string;
  description: string;
  nextPage: (formData: FormData) => void;
  previousPage: (formData: FormData) => void;
  isLastEvent?: boolean;
  loading: boolean;
}

const RsvpEvents: React.FC<RsvpEventPageProps> = ({
                                                    eventKey,
                                                    title,
                                                    time,
                                                    description,
                                                    nextPage,
                                                    previousPage,
                                                    isLastEvent,
                                                    loading,
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
      <StepLayout
          title={title}
          header={time}
          description={description}
          onBack={() => previousPage(formData)}
          onNext={() => nextPage(formData)}
          nextText={isLastEvent ?
              (loading ? <CircularProgress size={24} color={"secondary"} /> : "Submit RSVP") :
              "Next"
          }
      >
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
                          height={60}
                          width={250}
                          marginBottom={1}
                      />
                  );
                })}
              </Box>
            </>
        )}
      </StepLayout>
  );
};

export default RsvpEvents;
