// components/admin/adminGuestTable/AdminGuestController.tsx
import React, { useMemo, useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRsvpData } from "../../../hooks/rsvp/useRsvpData";
import { Rsvp } from "../../../types/rsvp";
import GuestTable from "./GuestTable";

export type EventType = 'all' | 'roce' | 'rehearsal' | 'ceremony' | 'reception';

export interface AggregatedGuest {
  name: string;
  dietaryRestrictions: string[];
  other: string;
  events: {
    roce: 'Coming' | 'Not Coming' | 'Pending' | null;
    rehearsal: 'Coming' | 'Not Coming' | 'Pending' | null;
    ceremony: 'Coming' | 'Not Coming' | 'Pending' | null;
    reception: 'Coming' | 'Not Coming' | 'Pending' | null;
  };
  rsvpId: string;
  guestId: string;
}

const AdminGuestController: React.FC = () => {
  const { data } = useRsvpData();
  const [selectedEvent, setSelectedEvent] = useState<EventType>('all');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Aggregate all guests from each RSVP into one list.
  const aggregatedGuests: AggregatedGuest[] = useMemo(() => {
    if (!data) return [];
    const guests: AggregatedGuest[] = [];
    data.forEach((rsvp: Rsvp) => {
      Object.keys(rsvp.guest_list).forEach((guestId) => {
        const guestDetail = rsvp.guest_list[guestId];
        // Compute status for each event based on RSVP submission and invitation.
        const computeStatus = (
            eventField: { invited: boolean; guests_attending: string[] }
        ): 'Coming' | 'Not Coming' | 'Pending' | null => {
          if (!eventField.invited) return null;
          if (!rsvp.submitted) return 'Pending';
          return eventField.guests_attending.includes(guestId) ? 'Coming' : 'Not Coming';
        };

        const events = {
          roce: computeStatus(rsvp.roce),
          rehearsal: computeStatus(rsvp.rehearsal),
          ceremony: computeStatus(rsvp.ceremony),
          reception: computeStatus(rsvp.reception),
        };

        guests.push({
          name: guestDetail.display_name,
          dietaryRestrictions: guestDetail.dietary_restrictions,
          other: guestDetail.other,
          events,
          rsvpId: rsvp.rsvp_id,
          guestId,
        });
      });
    });
    return guests;
  }, [data]);

  // When a specific event is selected, filter to only include guests invited for that event.
  const filteredGuests = useMemo(() => {
    if (selectedEvent === 'all') return aggregatedGuests;
    return aggregatedGuests.filter(guest => guest.events[selectedEvent] !== null);
  }, [aggregatedGuests, selectedEvent]);

  return (
      <Paper
          sx={{
            maxWidth: 1200,
            mx: "auto",
            p: 2,
            bgcolor: (theme) => theme.palette.secondary.light,
          }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Guest List
        </Typography>
        {isMobile ? (
            // Mobile friendly: Use a Select dropdown for event filtering.
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-event-label">Event</InputLabel>
              <Select
                  labelId="select-event-label"
                  id="select-event"
                  value={selectedEvent}
                  label="Event"
                  onChange={(e) => setSelectedEvent(e.target.value as EventType)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="roce">Roce</MenuItem>
                <MenuItem value="rehearsal">Rehearsal</MenuItem>
                <MenuItem value="ceremony">Ceremony</MenuItem>
                <MenuItem value="reception">Reception</MenuItem>
              </Select>
            </FormControl>
        ) : (
            // Desktop: Use tabs.
            <Tabs
                value={selectedEvent}
                onChange={(_e, newValue) => setSelectedEvent(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ mb: 2 }}
            >
              <Tab label="All" value="all" />
              <Tab label="Roce" value="roce" />
              <Tab label="Rehearsal" value="rehearsal" />
              <Tab label="Ceremony" value="ceremony" />
              <Tab label="Reception" value="reception" />
            </Tabs>
        )}
        <GuestTable guests={filteredGuests} selectedEvent={selectedEvent} />
      </Paper>
  );
};

export default AdminGuestController;
