package com.paulsen.wedding.model.newRsvp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.paulsen.wedding.util.StringFormatUtil;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class CreateRsvpDTO {
    private String primaryName;
    private String phoneNumber;
    private String email;
    private String address;

    private Set<String> allowedGuestDisplayNames;

    private int numGuestsAllowedRoce;
    private int numGuestsAllowedRehearsal;
    private int numGuestsAllowedCeremony;
    private int numGuestsAllowedReception;

    public Rsvp toRsvp() {
        Rsvp rsvp = new Rsvp();

        rsvp.setSubmitted(false);
        rsvp.setPrimaryContact(new WeddingPrimaryContact(primaryName, phoneNumber, email, address));
        rsvp.setGuestList(toRsvpGuestDetailsMap(allowedGuestDisplayNames));
        rsvp.setRoce(new Event(numGuestsAllowedRoce, Collections.emptyList()));
        rsvp.setRehearsal(new Event(numGuestsAllowedRehearsal, Collections.emptyList()));
        rsvp.setCeremony(new Event(numGuestsAllowedCeremony, Collections.emptyList()));
        rsvp.setReception(new Event(numGuestsAllowedReception, Collections.emptyList()));

        return rsvp;
    }

    @JsonProperty("primary_name")
    public String getPrimaryName() {
        return primaryName;
    }

    @JsonProperty("primary_name")
    public void setPrimaryName(String primaryName) {
        this.primaryName = primaryName;
    }

    @JsonProperty("phone_number")
    public String getPhoneNumber() {
        return phoneNumber;
    }

    @JsonProperty("phone_number")
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    @JsonProperty("email")
    public void setEmail(String email) {
        this.email = email;
    }

    @JsonProperty("address")
    public String getAddress() {
        return address;
    }

    @JsonProperty("address")
    public void setAddress(String address) {
        this.address = address;
    }

    @JsonProperty("allowed_guests")
    public Set<String> getAllowedGuestDisplayNames() {
        return allowedGuestDisplayNames;
    }

    @JsonProperty("allowed_guests")
    public void setAllowedGuestDisplayNames(Set<String> allowedGuestDisplayNames) {
        this.allowedGuestDisplayNames = allowedGuestDisplayNames;
    }

    @JsonProperty("max_guests_roce")
    public int getNumGuestsAllowedRoce() {
        return numGuestsAllowedRoce;
    }

    @JsonProperty("max_guests_roce")
    public void setNumGuestsAllowedRoce(int numGuestsAllowedRoce) {
        this.numGuestsAllowedRoce = numGuestsAllowedRoce;
    }

    @JsonProperty("max_guests_rehearsal")
    public int getNumGuestsAllowedRehearsal() {
        return numGuestsAllowedRehearsal;
    }

    @JsonProperty("max_guests_rehearsal")
    public void setNumGuestsAllowedRehearsal(int numGuestsAllowedRehearsal) {
        this.numGuestsAllowedRehearsal = numGuestsAllowedRehearsal;
    }

    @JsonProperty("max_guests_ceremony")
    public int getNumGuestsAllowedCeremony() {
        return numGuestsAllowedCeremony;
    }

    @JsonProperty("max_guests_ceremony")
    public void setNumGuestsAllowedCeremony(int numGuestsAllowedCeremony) {
        this.numGuestsAllowedCeremony = numGuestsAllowedCeremony;
    }

    @JsonProperty("max_guests_reception")
    public int getNumGuestsAllowedReception() {
        return numGuestsAllowedReception;
    }

    @JsonProperty("max_guests_reception")
    public void setNumGuestsAllowedReception(int numGuestsAllowedReception) {
        this.numGuestsAllowedReception = numGuestsAllowedReception;
    }

    private static Map<String, RsvpGuestDetails> toRsvpGuestDetailsMap(Set<String> allowedGuestDisplayNames) {
        if (allowedGuestDisplayNames == null) return Collections.emptyMap();

        Map<String, RsvpGuestDetails> rsvpGuestDetailsMap = new HashMap<>();

        for (String displayName : allowedGuestDisplayNames) {
            rsvpGuestDetailsMap.put(StringFormatUtil.formatToIndexName(displayName), new RsvpGuestDetails(displayName));
        }

        return rsvpGuestDetailsMap;
    }
}
