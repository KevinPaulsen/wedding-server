package com.paulsen.wedding.service;

import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.repositories.WeddingGuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service public class WeddingGuestService {

    private final WeddingGuestRepository weddingGuestRepository;

    public WeddingGuestService(WeddingGuestRepository guestRepository) {
        this.weddingGuestRepository = guestRepository;
    }

    public List<WeddingGuest> allGuests() {
        List<WeddingGuest> weddingGuests = new ArrayList<>();
        weddingGuestRepository.findAll().forEach(weddingGuests::add);
        return weddingGuests;
    }

    public WeddingGuest getGuest(String firstName, String lastName) {
        String fullName = getFullName(firstName, lastName);
        return weddingGuestRepository.findByFullName(fullName).orElseThrow(() -> new IllegalArgumentException("RSVP with name " + fullName + " not found."));
    }

    @Transactional public WeddingGuest addGuest(String firstName, String lastName, String rsvpId) {
        // Validate primary_contact (must not be null and must have a non-empty name)
        if (rsvpId == null || rsvpId.isEmpty()) {
            throw new IllegalArgumentException("RsvpID must be non-null and non-empty.");
        }

        String fullName = getFullName(firstName, lastName);

        WeddingGuest existingRsvp = weddingGuestRepository.findByFullName(fullName).orElse(null);
        List<String> otherRsvps = existingRsvp == null ? null : existingRsvp.getRsvpIds();

        WeddingGuest newWeddingGuest = new WeddingGuest();
        newWeddingGuest.setFullName(fullName);
        newWeddingGuest.setRsvpIds(
                otherRsvps == null ? List.of(rsvpId) : Stream.concat(otherRsvps.stream(), Stream.of(rsvpId)).toList());

        return weddingGuestRepository.save(newWeddingGuest);
    }

    @Transactional public void removeGuest(String fistName, String lastName, String rsvpId) {
        // Validate primary_contact (must not be null and must have a non-empty name)
        if (rsvpId == null || rsvpId.isEmpty()) {
            throw new IllegalArgumentException("RsvpID must be non-null and non-empty.");
        }

        String fullName = getFullName(fistName, lastName);

        WeddingGuest existingRsvp = weddingGuestRepository.findByFullName(fullName).orElse(null);
        List<String> otherRsvps = existingRsvp == null ? null : existingRsvp.getRsvpIds();

        WeddingGuest newWeddingGuest = new WeddingGuest();
        newWeddingGuest.setFullName(fullName);
        newWeddingGuest.setRsvpIds(
                otherRsvps == null ? List.of() : otherRsvps.stream().filter(id -> !id.equals(rsvpId)).toList());

        if (newWeddingGuest.getRsvpIds().isEmpty()) {
            weddingGuestRepository.deleteById(fullName);
        } else {
            weddingGuestRepository.save(newWeddingGuest);
        }
    }

    private String getFullName(String firstName, String lastName) {
        if (firstName == null || lastName == null || (firstName.trim().isEmpty() && lastName.trim().isEmpty())) {
            throw new IllegalArgumentException("First name and last name must be non-null and non-empty.");
        }

        return (firstName.trim() + " " + lastName.trim()).toLowerCase();
    }
}
