package com.paulsen.wedding.model.newRsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RsvpGuestDetails {
    @DynamoDBAttribute(attributeName="dietary_restrictions")
    private List<DietaryRestriction> dietaryRestrictions;
    @DynamoDBAttribute(attributeName="other")
    private String other;

    public RsvpGuestDetails() {}

    public RsvpGuestDetails(List<DietaryRestriction> dietaryRestrictions, String other) {
        this.dietaryRestrictions = dietaryRestrictions;
        this.other = other;
    }

    @JsonProperty("dietary_restrictions")
    public List<DietaryRestriction> getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    @JsonProperty("dietary_restrictions")
    public void setDietaryRestrictions(List<DietaryRestriction> dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String getOther() {
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }
}
