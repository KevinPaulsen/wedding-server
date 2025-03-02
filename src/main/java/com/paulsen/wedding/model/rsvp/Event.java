package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Event {
    @DynamoDBAttribute(attributeName="guests_attending") private List<String> guestsAttending;

    public Event() {
    }

    public Event(List<String> guestsAttending) {
        this.guestsAttending = guestsAttending;
    }

    @JsonProperty("guests_attending") public List<String> getGuestsAttending() {
        return guestsAttending;
    }

    @JsonProperty("guests_attending") public void setGuestsAttending(List<String> guestsAttending) {
        this.guestsAttending = guestsAttending;
    }
}
