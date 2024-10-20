package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperFieldModel;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTyped;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@DynamoDBTable(tableName="wedding_rsvps") public class Rsvp {

    @DynamoDBHashKey(attributeName="rsvp_code") @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S)
    private String rsvpCode;

    @DynamoDBAttribute(attributeName="primary_contact") @DynamoDBTypeConverted(converter=GuestInfoConverter.class)
    private GuestInfo primaryContact;

    @DynamoDBAttribute(attributeName = "lastnames")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.SS)
    private Set<String> lastnames;

    @DynamoDBAttribute(attributeName="allowed_guest_count")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.N) private int allowedGuestCount;

    @DynamoDBAttribute(attributeName="rsvp_details") @DynamoDBTypeConverted(converter=RsvpGuestDetailsConverter.class)
    private List<RsvpGuestDetails> rsvpGuestDetails;

    @DynamoDBAttribute(attributeName="rsvp_status") @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S)
    private RsvpStatus rsvpStatus;

    public String getRsvpCode() {
        return rsvpCode;
    }

    public void setRsvpCode(String rsvpCode) {
        if (rsvpCode == null || rsvpCode.isEmpty()) {
            throw new IllegalArgumentException("RSVP code cannot be empty");
        }

        this.rsvpCode = rsvpCode;
    }

    public GuestInfo getPrimaryContact() {
        return primaryContact;
    }

    public void setPrimaryContact(GuestInfo primaryContact) {
        this.primaryContact = primaryContact;

        if (primaryContact != null) {
            lastnames = Objects.requireNonNullElse(lastnames, new HashSet<>());
            lastnames.add(extractLastName(primaryContact.name()));
        }
    }

    public Set<String> getLastnames() {
        lastnames = Objects.requireNonNullElse(lastnames, new HashSet<>());
        return lastnames;
    }

    public void setLastnames(Set<String> lastnames) {
        this.lastnames = lastnames;
    }

    public RsvpStatus getRsvpStatus() {
        return Objects.requireNonNullElse(rsvpStatus, RsvpStatus.PENDING);
    }

    public void setRsvpStatus(RsvpStatus rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    private static String extractLastName(String name) {
        String[] names = name.strip().split("\\s+", 2);

        if (names.length == 1) {
            return "";
        } else {
            return names[1].toLowerCase();
        }
    }

    public int getAllowedGuestCount() {
        return allowedGuestCount;
    }

    public void setAllowedGuestCount(int allowedGuestCount) {
        if (allowedGuestCount < 0) {
            throw new IllegalArgumentException("Allowed guest count cannot be negative");
        }

        this.allowedGuestCount = allowedGuestCount;
    }

    public List<RsvpGuestDetails> getRsvpGuestDetails() {
        return rsvpGuestDetails;
    }

    public void setRsvpGuestDetails(List<RsvpGuestDetails> rsvpGuestDetails) {
        if (rsvpGuestDetails == null) {
            rsvpGuestDetails = new ArrayList<>();
        }

        this.rsvpGuestDetails = rsvpGuestDetails;

        lastnames = Objects.requireNonNullElse(lastnames, new HashSet<>());
        for (RsvpGuestDetails rsvpGuestDetail : rsvpGuestDetails) {
            if (rsvpGuestDetail != null && rsvpGuestDetail.name() != null) {
                lastnames.add(extractLastName(rsvpGuestDetail.name()));
            }
        }
    }

    @Override public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rsvp rsvp)) {
            return false;
        }

        return getAllowedGuestCount() == rsvp.getAllowedGuestCount() &&
               Objects.equals(getRsvpCode(), rsvp.getRsvpCode()) &&
               Objects.equals(getPrimaryContact(), rsvp.getPrimaryContact()) &&
               Objects.equals(getRsvpGuestDetails(), rsvp.getRsvpGuestDetails()) &&
               getRsvpStatus() == rsvp.getRsvpStatus();
    }

    @Override public int hashCode() {
        int result = Objects.hashCode(getRsvpCode());
        result = 31 * result + Objects.hashCode(getPrimaryContact());
        result = 31 * result + getAllowedGuestCount();
        result = 31 * result + Objects.hashCode(getRsvpGuestDetails());
        result = 31 * result + Objects.hashCode(getRsvpStatus());
        return result;
    }
}
