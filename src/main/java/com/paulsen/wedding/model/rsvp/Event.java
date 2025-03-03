package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Event {
    @DynamoDBAttribute(attributeName="invited") private Boolean isInvited = false;
    @DynamoDBAttribute(attributeName="guests_attending") private List<String> guestsAttending;

    public Event() {
        this(false, List.of());
    }

    public Event(Boolean isInvited, List<String> guestsAttending) {
        this.isInvited = isInvited;
        this.guestsAttending = guestsAttending;
    }

    @JsonProperty("invited")
    public Boolean getInvited() {
        return isInvited;
    }

    @JsonProperty("invited")
    public void setInvited(Boolean invited) {
        isInvited = invited;
    }

    @JsonProperty("guests_attending") public List<String> getGuestsAttending() {
        return guestsAttending;
    }

    @JsonProperty("guests_attending") public void setGuestsAttending(List<String> guestsAttending) {
        this.guestsAttending = guestsAttending;
    }
}
