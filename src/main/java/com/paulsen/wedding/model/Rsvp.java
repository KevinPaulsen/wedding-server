package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperFieldModel;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTyped;

import java.util.List;
import java.util.Objects;

@DynamoDBTable(tableName="wedding_rsvps")
public class Rsvp {

    @DynamoDBHashKey(attributeName="rsvp_code")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S)
    private String rsvpCode;

    @DynamoDBAttribute(attributeName="primary_contact")
    @DynamoDBTypeConverted(converter=GuestInfoConverter.class)
    private GuestInfo primaryContact;

    @DynamoDBAttribute(attributeName="last_names")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.L)
    private List<String> lastNames;

    @DynamoDBAttribute(attributeName="allowed_guest_count")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.N)
    private Integer allowedGuestCount;

    @DynamoDBAttribute(attributeName="guest_count")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.N)
    private Integer guestCount;

    @DynamoDBAttribute(attributeName="rsvp_details")
    @DynamoDBTypeConverted(converter=RsvpGuestDetailsConverter.class)
    private List<RsvpGuestDetails> rsvpGuestDetails;


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

    public List<String> getLastNames() {
        return lastNames;
    }

    public void setLastNames(List<String> lastNames) {
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

    public List<RsvpGuestDetails> getRsvpGuestDetails() {
        return rsvpGuestDetails;
    }

    public void setRsvpGuestDetails(List<RsvpGuestDetails> rsvpGuestDetails) {
        this.rsvpGuestDetails = rsvpGuestDetails;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Rsvp rsvp))
            return false;

        return getAllowedGuestCount() == rsvp.getAllowedGuestCount() && getGuestCount() == rsvp.getGuestCount() && getRsvpCode().equals(rsvp.getRsvpCode()) && getPrimaryContact().equals(rsvp.getPrimaryContact()) && getLastNames().equals(rsvp.getLastNames()) && Objects.equals(getRsvpGuestDetails(), rsvp.getRsvpGuestDetails());
    }

    @Override
    public int hashCode() {
        int result = getRsvpCode().hashCode();
        result = 31 * result + getPrimaryContact().hashCode();
        result = 31 * result + getLastNames().hashCode();
        result = 31 * result + getAllowedGuestCount();
        result = 31 * result + getGuestCount();
        result = 31 * result + Objects.hashCode(getRsvpGuestDetails());
        return result;
    }
}
