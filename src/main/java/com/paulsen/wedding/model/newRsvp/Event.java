package com.paulsen.wedding.model.newRsvp;

import com.paulsen.wedding.model.newRsvp.dto.EventDTO;

import java.util.List;

public record Event(int allowedGuests, List<String> guestsAttending) {
    public Event(EventDTO dto) {
        this(dto.getAllowed_guests(), dto.getGuests_attending());
    }
}
