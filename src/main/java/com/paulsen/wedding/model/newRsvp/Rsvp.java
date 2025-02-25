package com.paulsen.wedding.model.newRsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAutoGeneratedKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.paulsen.wedding.model.newRsvp.converters.EventConverter;
import com.paulsen.wedding.model.newRsvp.converters.GuestInfoConverter;
import com.paulsen.wedding.model.newRsvp.converters.RsvpGuestDetailsMapConverter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@DynamoDBTable(tableName="wedding_rsvp_table") public class Rsvp {

    @DynamoDBHashKey(attributeName="rsvp_id")
    @DynamoDBAutoGeneratedKey
    private String rsvpId;

    @DynamoDBAttribute(attributeName="submitted")
    private boolean isSubmitted;

    @DynamoDBAttribute(attributeName="primary_contact") @DynamoDBTypeConverted(converter=GuestInfoConverter.class)
    private WeddingPrimaryContact primaryContact;

    @DynamoDBAttribute(attributeName="guest_list") @DynamoDBTypeConverted(converter=RsvpGuestDetailsMapConverter.class)
    private Map<String, RsvpGuestDetails> guestList;

    @DynamoDBAttribute(attributeName="roce") @DynamoDBTypeConverted(converter=EventConverter.class)
    private Event roce;

    @DynamoDBAttribute(attributeName="rehearsal") @DynamoDBTypeConverted(converter=EventConverter.class)
    private Event rehearsal;

    @DynamoDBAttribute(attributeName="ceremony") @DynamoDBTypeConverted(converter=EventConverter.class)
    private Event ceremony;

    @DynamoDBAttribute(attributeName="reception") @DynamoDBTypeConverted(converter=EventConverter.class)
    private Event reception;

    public Rsvp() {
    }

    @JsonProperty("rsvp_id")
    public String getRsvpId() {
        return rsvpId;
    }

    @JsonProperty("rsvp_id")
    public void setRsvpId(String rsvpId) {
        this.rsvpId = rsvpId;
    }

    @JsonProperty("submitted")
    public boolean isSubmitted() {
        return isSubmitted;
    }

    @JsonProperty("submitted")
    public void setSubmitted(boolean submitted) {
        isSubmitted = submitted;
    }

    @JsonProperty("primary_contact")
    public WeddingPrimaryContact getPrimaryContact() {
        return primaryContact;
    }

    @JsonProperty("primary_contact")
    public void setPrimaryContact(WeddingPrimaryContact primaryContact) {
        this.primaryContact = primaryContact;
    }

    @JsonProperty("guest_list")
    public Map<String, RsvpGuestDetails> getGuestList() {
        return guestList;
    }

    @JsonProperty("guest_list")
    public void setGuestList(Map<String, RsvpGuestDetails> guestList) {
        this.guestList = guestList;
    }

    @JsonProperty("roce")
    public Event getRoce() {
        return roce;
    }

    @JsonProperty("roce")
    public void setRoce(Event roce) {
        this.roce = roce;
    }

    @JsonProperty("rehearsal")
    public Event getRehearsal() {
        return rehearsal;
    }

    @JsonProperty("rehearsal")
    public void setRehearsal(Event rehearsal) {
        this.rehearsal = rehearsal;
    }

    @JsonProperty("ceremony")
    public Event getCeremony() {
        return ceremony;
    }

    @JsonProperty("ceremony")
    public void setCeremony(Event ceremony) {
        this.ceremony = ceremony;
    }

    @JsonProperty("reception")
    public Event getReception() {
        return reception;
    }

    @JsonProperty("reception")
    public void setReception(Event reception) {
        this.reception = reception;
    }

    @DynamoDBIgnore
    @JsonIgnore
    public List<Event> getNonNullEvents() {
        List<Event> events = new ArrayList<>();

        if (roce != null) events.add(roce);
        if (rehearsal != null) events.add(rehearsal);
        if (ceremony != null) events.add(ceremony);
        if (reception != null) events.add(reception);

        return events;
    }
}
