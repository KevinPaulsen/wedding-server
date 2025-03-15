// components/main/rsvpFlow/GuestSelection.tsx
import React from 'react';
import {Box, FormControlLabel, Switch, Typography} from '@mui/material';
import {useFlow} from '../../../context/FlowProvider';
import {Rsvp} from "../../../types/rsvp";
import CustomButton from "../../shared/CustomButton";

interface GuestSelectionProps {
  eventKey: 'roce' | 'rehearsal' | 'ceremony' | 'reception';
  backPage: (formData: Rsvp) => void;
  nextPage: (formData: Rsvp, resetFormData?: () => void) => void;
  loading?: boolean;
}

const GuestSelection: React.FC<GuestSelectionProps> = ({
                                                         eventKey,
                                                         backPage,
                                                         nextPage,
                                                         loading = null,
                                                       }) => {
  const {formData, resetFormData, setFormData} = useFlow();
  const guestList = formData.guest_list || {};
  const comingGuestKeys = Object.keys(guestList).filter(
      (guestKey) => guestList[guestKey].coming
  );
  const eventData = formData[eventKey];

  if (!eventData || !eventData.invited) {
    return null;
  }

  const handleToggle = (guestKey: string) => {
    const alreadyAttending = eventData.guests_attending || [];
    const updated = alreadyAttending.includes(guestKey)
        ? alreadyAttending.filter((id: string) => id !== guestKey)
        : [...alreadyAttending, guestKey];

    setFormData({
      [eventKey]: {
        ...eventData,
        guests_attending: updated,
      },
    });
  };

  const handleSelectAllToggle = () => {
    const allSelected = comingGuestKeys.every((guestKey) =>
        eventData.guests_attending.includes(guestKey)
    );
    if (allSelected) {
      const updated = (eventData.guests_attending || []).filter(
          (guestKey) => !comingGuestKeys.includes(guestKey)
      );
      setFormData({
        [eventKey]: {
          ...eventData,
          guests_attending: updated,
        },
      });
    } else {
      setFormData({
        [eventKey]: {
          ...eventData,
          guests_attending: comingGuestKeys,
        },
      });
    }
  };

  const allSelected = comingGuestKeys.every((guestKey) =>
      eventData.guests_attending.includes(guestKey)
  );

  const numGuests = comingGuestKeys.length;
  const numComing = comingGuestKeys.filter((guestKey) =>
      eventData.guests_attending.includes(guestKey)
  ).length;

  return (
      <Box sx={{p: 3}}>
        {!eventData.invited ? (
            <Typography>You have no invitation.</Typography>
        ) : (
            <>
              <FormControlLabel
                  control={
                    <Switch checked={allSelected} onChange={handleSelectAllToggle}
                            name="allComingSwitch"/>
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
                {comingGuestKeys.map((guestKey) => {
                  const guest = guestList[guestKey];
                  const isAttending = eventData.guests_attending.includes(guestKey);
                  return (
                      <CustomButton
                          key={guestKey}
                          text={guest.display_name}
                          onClick={() => handleToggle(guestKey)}
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
        <Box sx={{display: 'flex', justifyContent: 'space-evenly', mt: 3}}>
          <CustomButton text="Back" onClick={() => backPage(formData)} variant="dark" width={75}/>
          <CustomButton
              text={
                loading === null
                    ? 'Next'
                    : loading
                        ? 'Submitting...'
                        : 'Submit'
              }
              onClick={() => nextPage(formData, resetFormData)}
              variant="dark"
              width="auto"
          />
        </Box>
      </Box>
  );
};

export default GuestSelection;
