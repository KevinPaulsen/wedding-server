package com.paulsen.wedding.model.newRsvp.dto;

import com.paulsen.wedding.model.newRsvp.DietaryRestriction;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;

import java.util.List;

public class RsvpGuestDetailsDTO {
    private String name;
    private List<DietaryRestriction> dietary_Restrictions;
    private String other;

    public RsvpGuestDetailsDTO(RsvpGuestDetails details) {
        if (details == null) return;

        this.name = details.name();
        this.dietary_Restrictions = List.copyOf(details.dietaryRestrictions());
        this.other = details.other();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<DietaryRestriction> getDietary_Restrictions() {
        return dietary_Restrictions;
    }

    public void setDietary_Restrictions(List<DietaryRestriction> dietary_Restrictions) {
        this.dietary_Restrictions = dietary_Restrictions;
    }

    public String getOther() {
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }
}
