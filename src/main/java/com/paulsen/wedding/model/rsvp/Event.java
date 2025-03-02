package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Event {
    @DynamoDBAttribute(attributeName="allowed_guests") private int allowedGuests = -1;
    @DynamoDBAttribute(attributeName="guests_attending") private List<String> guestsAttending;

    public Event() {
    }

    public Event(int allowedGuests, List<String> guestsAttending) {
        this.allowedGuests = allowedGuests;
        this.guestsAttending = guestsAttending;
    }

    @JsonProperty("allowed_guests") public int getAllowedGuests() {
        return allowedGuests;
    }

    @JsonProperty("allowed_guests") public void setAllowedGuests(int allowedGuests) {
        this.allowedGuests = allowedGuests;
    }

    @JsonProperty("guests_attending") public List<String> getGuestsAttending() {
        return guestsAttending;
    }

    @JsonProperty("guests_attending") public void setGuestsAttending(List<String> guestsAttending) {
        this.guestsAttending = guestsAttending;
    }
}
