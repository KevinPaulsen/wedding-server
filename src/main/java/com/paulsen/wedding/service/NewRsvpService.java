package com.paulsen.wedding.service;

import com.amazonaws.services.dynamodbv2.xspec.L;
import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.newRsvp.dto.RsvpDTO;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service public class NewRsvpService {

    private final NewRsvpRepository rsvpRepository;

    public NewRsvpService(NewRsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    public List<Rsvp> allRsvps() {
        List<Rsvp> rsvps = new ArrayList<>();
        rsvpRepository.findAll().forEach(rsvps::add);
        return rsvps;
    }

    @Transactional public Rsvp createRsvp(RsvpDTO input) {
        // Validate primary_contact (must not be null and must have a non-empty name)
        if (input.getPrimary_contact() == null || input.getPrimary_contact().name() == null ||
            input.getPrimary_contact().name().trim().isEmpty()) {
            throw new IllegalArgumentException("Primary contact and name are required.");
        }
        GuestInfo primary = input.getPrimary_contact();
        String name = primary.name();
        String email = Objects.requireNonNullElse(primary.email(), "").trim();
        String phone = Objects.requireNonNullElse(primary.phoneNumber(), "").trim();
        String address = Objects.requireNonNullElse(primary.address(), "").trim();

        // Validate guest_list; if null, default to empty list.
        List<RsvpGuestDetails> guestList = new ArrayList<>();
        if (input.getGuest_list() != null) {
            for (RsvpGuestDetails guest : input.getGuest_list()) {
                if (guest.name() == null || guest.name().trim().isEmpty()) {
                    throw new IllegalArgumentException("Each guest must have a non-empty name.");
                }

                guestList.add(guest);
            }
        }

        Rsvp rsvp = new Rsvp();
        rsvp.setSubmitted(input.isIs_submitted());
        rsvp.setPrimaryContact(new GuestInfo(name, email, phone, address));
        rsvp.setGuestList(guestList);

        if (input.getRoce() == null) {
            rsvp.setRoce(new Event(0, List.of()));
        } else {
            rsvp.setRoce(new Event(Math.max(input.getRoce().allowedGuests(), 0),
                                   Objects.requireNonNullElse(input.getRoce().guestsAttending(), List.of())));
        }
        if (input.getRehearsal() == null) {
            rsvp.setRehearsal(new Event(0, List.of()));
        } else {
            rsvp.setRehearsal(new Event(Math.max(input.getRehearsal().allowedGuests(), 0),
                                        Objects.requireNonNullElse(input.getRehearsal().guestsAttending(), List.of())));
        }
        if (input.getCeremony() == null) {
            rsvp.setCeremony(new Event(0, List.of()));
        } else {
            rsvp.setCeremony(new Event(Math.max(input.getCeremony().allowedGuests(), 0),
                                   Objects.requireNonNullElse(input.getCeremony().guestsAttending(), List.of())));
        }
        if (input.getReception() == null) {
            rsvp.setReception(new Event(0, List.of()));
        } else {
            rsvp.setReception(new Event(Math.max(input.getReception().allowedGuests(), 0),
                                   Objects.requireNonNullElse(input.getReception().guestsAttending(), List.of())));
        }

        return rsvpRepository.save(rsvp);
    }

    @Transactional public Rsvp updateRsvp(RsvpDTO input) {
        // Ensure the rsvp_id is provided
        if (input.getRsvp_id() == null || input.getRsvp_id().trim().isEmpty()) {
            throw new IllegalArgumentException("RSVP id is required for update.");
        }
        Rsvp existingRsvp = rsvpRepository.findById(input.getRsvp_id())
                                          .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));

        existingRsvp.setSubmitted(input.isIs_submitted());

        // Update primary_contact if provided
        if (input.getPrimary_contact() != null) {
            GuestInfo current = existingRsvp.getPrimaryContact();
            GuestInfo newContact = input.getPrimary_contact();

            String updatedName = Objects.requireNonNullElse(newContact.name(), current.name()).trim();
            if (updatedName.isEmpty()) {
                throw new IllegalArgumentException("Primary contact name must not be null or empty.");
            }

            String updatedEmail = Objects.requireNonNullElse(newContact.email(), current.email()).trim();
            String updatedPhone = Objects.requireNonNullElse(newContact.phoneNumber(), current.phoneNumber()).trim();
            String updatedAddress = Objects.requireNonNullElse(newContact.address(), current.address()).trim();

            existingRsvp.setPrimaryContact(new GuestInfo(updatedName, updatedEmail, updatedPhone, updatedAddress));
        }

        // Update guest_list if provided (assumes the entire list is replaced)
        if (input.getGuest_list() != null) {
            List<RsvpGuestDetails> updatedGuestList = new ArrayList<>();
            for (RsvpGuestDetails guest : input.getGuest_list()) {
                if (guest.name() == null || guest.name().trim().isEmpty()) {
                    throw new IllegalArgumentException("Each guest must have a non-empty name.");
                }

                updatedGuestList.add(new RsvpGuestDetails(guest.name(),
                                                          Objects.requireNonNullElse(guest.dietaryRestrictions(),
                                                                                     new ArrayList<>()),
                                                          Objects.requireNonNullElse(guest.other(), "")));
            }
            existingRsvp.setGuestList(updatedGuestList);
        }

        // Update event objects if provided
        if (input.getRoce() != null) {
            existingRsvp.setRoce(input.getRoce());
        }
        if (input.getRehearsal() != null) {
            existingRsvp.setRehearsal(input.getRehearsal());
        }
        if (input.getCeremony() != null) {
            existingRsvp.setCeremony(input.getRehearsal());
        }
        if (input.getReception() != null) {
            existingRsvp.setReception(input.getReception());
        }

        return rsvpRepository.save(existingRsvp);
    }

    @Transactional public void delete(String rsvpId) {
        if (rsvpId == null || rsvpId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid RSVP ID provided.");
        }
        if (!rsvpRepository.existsById(rsvpId)) {
            throw new IllegalArgumentException("RSVP object not found.");
        }
        rsvpRepository.deleteById(rsvpId);
    }
}
