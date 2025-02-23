package com.paulsen.wedding.model.newRsvp;

import java.util.List;

public record RsvpGuestDetails(String name, List<DietaryRestriction> dietaryRestrictions, String other) {
}
