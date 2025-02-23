package com.paulsen.wedding.model.newRsvp;

import java.util.List;

public record Event(int allowedGuests, List<String> guestsAttending) {}
