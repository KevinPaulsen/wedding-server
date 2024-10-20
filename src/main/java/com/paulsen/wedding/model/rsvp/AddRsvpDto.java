package com.paulsen.wedding.model.rsvp;

import java.util.List;
import java.util.Set;

public class AddRsvpDto {

    private String rsvpCode;
    private RsvpStatus rsvpStatus;
    private GuestInfo primaryContact;
    private Set<String> lastnames;
    private int allowedGuestCount;
    private List<RsvpGuestDetails> rsvpGuestDetails;

    public String getRsvpCode() {
        return rsvpCode;
    }

    public void setRsvpCode(String rsvpCode) {
        this.rsvpCode = rsvpCode;
    }

    public RsvpStatus getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(RsvpStatus rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public GuestInfo getPrimaryContact() {
        return primaryContact;
    }

    public Set<String> getLastnames() {
        return lastnames;
    }

    public void setLastnames(Set<String> lastnames) {
        this.lastnames = lastnames;
    }

    public void setPrimaryContact(GuestInfo primaryContact) {
        this.primaryContact = primaryContact;
    }

    public int getAllowedGuestCount() {
        return allowedGuestCount;
    }

    public void setAllowedGuestCount(int allowedGuestCount) {
        this.allowedGuestCount = allowedGuestCount;
    }

    public List<RsvpGuestDetails> getRsvpGuestDetails() {
        return rsvpGuestDetails;
    }

    public void setRsvpGuestDetails(List<RsvpGuestDetails> rsvpGuestDetails) {
        this.rsvpGuestDetails = rsvpGuestDetails;
    }
}
