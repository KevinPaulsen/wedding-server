package com.paulsen.wedding.model.newRsvp;

import com.paulsen.wedding.model.newRsvp.dto.RsvpGuestDetailsDTO;

import java.util.List;

public record RsvpGuestDetails(List<DietaryRestriction> dietaryRestrictions, String other) {
    public RsvpGuestDetails(RsvpGuestDetailsDTO value) {
        this(value.getDietary_Restrictions(), value.getOther());
    }
}
