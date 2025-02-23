package com.paulsen.wedding.model.newRsvp.dto;

import com.paulsen.wedding.model.newRsvp.Event;

import java.util.List;

public class EventDTO {
    private int allowed_guests;
    private List<String> guests_attending;

    public EventDTO() {
    }

    public EventDTO(int allowedGuests, List<String> guestsAttending) {
        this.allowed_guests = allowedGuests;
        this.guests_attending = guestsAttending;
    }

    public EventDTO(Event event) {
        if (event == null) return;

        this.allowed_guests = event.allowedGuests();
        this.guests_attending = event.guestsAttending() == null ? null : List.copyOf(event.guestsAttending());
    }

    public int getAllowed_guests() {
        return allowed_guests;
    }

    public void setAllowed_guests(int allowed_guests) {
        this.allowed_guests = allowed_guests;
    }

    public List<String> getGuests_attending() {
        return guests_attending;
    }

    public void setGuests_attending(List<String> guests_attending) {
        this.guests_attending = guests_attending;
    }
}
