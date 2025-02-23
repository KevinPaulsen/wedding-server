package com.paulsen.wedding.model.newRsvp;

import com.paulsen.wedding.model.newRsvp.dto.GuestInfoDTO;

public record GuestInfo(String name, String email, String phoneNumber, String address) {
    public GuestInfo(GuestInfoDTO primaryContact) {
        this(primaryContact.getName(), primaryContact.getEmail(), primaryContact.getPhone_number(), primaryContact.getAddress());
    }
}
