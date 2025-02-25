package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RsvpGuestDetails {
    @DynamoDBAttribute(attributeName="display_name") private String displayName;
    @DynamoDBAttribute(attributeName="dietary_restrictions") private List<DietaryRestriction> dietaryRestrictions;
    @DynamoDBAttribute(attributeName="other") private String other;

    public RsvpGuestDetails() {
    }

    public RsvpGuestDetails(String displayName) {
        this.displayName = displayName;
    }

    public RsvpGuestDetails(String displayName, List<DietaryRestriction> dietaryRestrictions, String other) {
        this.displayName = displayName;
        this.dietaryRestrictions = dietaryRestrictions;
        this.other = other;
    }

    @JsonProperty("display_name") public String getDisplayName() {
        return displayName;
    }

    @JsonProperty("display_name") public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @JsonProperty("dietary_restrictions") public List<DietaryRestriction> getDietaryRestrictions() {
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
