package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Arrays;
import java.util.Objects;

@DynamoDBTable(tableName="wedding_rsvps")
public class Rsvp {

    @DynamoDBHashKey(attributeName="rsvp_code")
    private String rsvpCode;


    @DynamoDBAttribute(attributeName="primary_contact")
    private GuestInfo primaryContact;

    @DynamoDBAttribute(attributeName="last_names")
    private String[] lastNames;

    @DynamoDBAttribute(attributeName="allowed_guest_count")
    private int allowedGuestCount;

    @DynamoDBAttribute(attributeName="guest_count")
    private int guestCount;

    @DynamoDBAttribute(attributeName="rsvp_details")
    private RsvpGuestDetails[] rsvpGuestDetails;

    public String getRsvpCode() {
        return rsvpCode;
    }

    public void setRsvpCode(String rsvpCode) {
        this.rsvpCode = rsvpCode;
    }

    public GuestInfo getPrimaryContact() {
        return primaryContact;
    }

    public void setPrimaryContact(GuestInfo primaryContact) {
        this.primaryContact = primaryContact;
    }

    public String[] getLastNames() {
        return lastNames;
    }

    public void setLastNames(String[] lastNames) {
        this.lastNames = lastNames;
    }

    public int getAllowedGuestCount() {
        return allowedGuestCount;
    }

    public void setAllowedGuestCount(int allowedGuestCount) {
        this.allowedGuestCount = allowedGuestCount;
    }

    public int getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(int guestCount) {
        this.guestCount = guestCount;
    }

    public RsvpGuestDetails[] getRsvpGuestDetails() {
        return rsvpGuestDetails;
    }

    public void setRsvpGuestDetails(RsvpGuestDetails[] rsvpGuestDetails) {
        this.rsvpGuestDetails = rsvpGuestDetails;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Rsvp rsvp))
            return false;

        return getAllowedGuestCount() == rsvp.getAllowedGuestCount() && getGuestCount() == rsvp.getGuestCount() && Objects.equals(getRsvpCode(), rsvp.getRsvpCode()) && Objects.equals(getPrimaryContact(), rsvp.getPrimaryContact()) && Arrays.equals(getLastNames(), rsvp.getLastNames()) && Arrays.equals(getRsvpGuestDetails(), rsvp.getRsvpGuestDetails());
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(getRsvpCode());
        result = 31 * result + Objects.hashCode(getPrimaryContact());
        result = 31 * result + Arrays.hashCode(getLastNames());
        result = 31 * result + getAllowedGuestCount();
        result = 31 * result + getGuestCount();
        result = 31 * result + Arrays.hashCode(getRsvpGuestDetails());
        return result;
    }
}
