package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore;
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

    @DynamoDBAttribute(attributeName="lastnames") @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.SS)
    private final Set<String> lastnames;
    @DynamoDBHashKey(attributeName="rsvp_code") @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S)
    private String rsvpCode;
    @DynamoDBAttribute(attributeName="primary_contact") @DynamoDBTypeConverted(converter=GuestInfoConverter.class)
    private GuestInfo primaryContact;
    @DynamoDBAttribute(attributeName="allowed_guest_count")
    @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.N) private int allowedGuestCount;

    @DynamoDBAttribute(attributeName="rsvp_details") @DynamoDBTypeConverted(converter=RsvpGuestDetailsConverter.class)
    private List<RsvpGuestDetails> rsvpGuestDetails;

    @DynamoDBAttribute(attributeName="rsvp_status") @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S)
    private RsvpStatus rsvpStatus;

    public Rsvp() {
        this.lastnames = new HashSet<>();
    }

    private static String formatName(String name) {
        return name.strip().toLowerCase().replaceAll("[^a-z]", "*");
    }

    private static String extractLastName(String name) {
        String[] names = name.strip().split("\\s+", 2);

        if (names.length == 1) {
            return "";
        } else {
            return formatName(names[1]);
        }
    }

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
        if (primaryContact == null) {
            return;
        }

        this.primaryContact = primaryContact;

        String lastname = extractLastName(primaryContact.name());
        if (!lastname.isEmpty()) {
            lastnames.add(lastname);
        }
    }

    public Set<String> getLastnames() {
        return lastnames;
    }

    public void setLastnames(Set<String> lastnames) {
        if (lastnames == null || lastnames.isEmpty()) {
            return;
        }

        this.lastnames.addAll(lastnames.stream().map(Rsvp::formatName).toList());
    }

    public RsvpStatus getRsvpStatus() {
        return Objects.requireNonNullElse(rsvpStatus, RsvpStatus.PENDING);
    }

    public void setRsvpStatus(RsvpStatus rsvpStatus) {
        this.rsvpStatus = Objects.requireNonNullElse(rsvpStatus, RsvpStatus.PENDING);
    }

    @DynamoDBIgnore public boolean hasLastname(String lastname) {
        return lastnames.contains(formatName(lastname));
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

        for (RsvpGuestDetails rsvpGuestDetail : rsvpGuestDetails) {

            if (rsvpGuestDetail == null || rsvpGuestDetail.name() == null) {
                continue;
            }

            String lastname = extractLastName(rsvpGuestDetail.name());
            if (!lastname.isEmpty()) {
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
