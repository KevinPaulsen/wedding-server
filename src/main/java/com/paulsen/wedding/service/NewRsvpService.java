package com.paulsen.wedding.service;

import com.paulsen.wedding.model.newRsvp.DietaryRestriction;
import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.newRsvp.dto.RsvpDTO;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class NewRsvpService {

    private final NewRsvpRepository rsvpRepository;

    public NewRsvpService(NewRsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    public List<Rsvp> allRsvps() {
        List<Rsvp> rsvps = new ArrayList<>();
        rsvpRepository.findAll().forEach(rsvps::add);
        return rsvps;
    }

    /**
     * Saves (creates or updates) an RSVP by merging the provided input with the stored values.
     *
     * <p>The merge rules are:
     * <ul>
     *   <li>If the input attribute is non-null, use it.</li>
     *   <li>If the input attribute is null and the stored attribute is null, use a default value.</li>
     *   <li>If the input attribute is null but the stored attribute is non-null, leave the stored value.</li>
     * </ul>
     * For nested objects (primary_contact, guest_list, events), merging is done per sub-field.
     * An exception is thrown if the final primary contact name is empty, or if any guest’s name is empty.
     * </p>
     */
    @Transactional
    public Rsvp saveRsvp(RsvpDTO input) {
        // Obtain the stored object; if no ID, create a new one.
        Rsvp stored = (input.getRsvp_id() == null || input.getRsvp_id().trim().isEmpty())
                      ? new Rsvp()
                      : rsvpRepository.findById(input.getRsvp_id())
                                      .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));

        // For booleans (submitted), always override.
        stored.setSubmitted(input.isIs_submitted());

        // Merge primary_contact.
        GuestInfo mergedPrimary = mergeGuestInfo(stored.getPrimaryContact(), input.getPrimary_contact());
        stored.setPrimaryContact(mergedPrimary);

        // Merge guest_list.
        Map<String, RsvpGuestDetails> mergedGuestList = mergeGuestList(stored.getGuestList(), input.getGuest_list());
        stored.setGuestList(mergedGuestList);

        // Merge events.
        stored.setRoce(mergeEvent(stored.getRoce(), input.getRoce()));
        stored.setRehearsal(mergeEvent(stored.getRehearsal(), input.getRehearsal()));
        stored.setCeremony(mergeEvent(stored.getCeremony(), input.getCeremony()));
        stored.setReception(mergeEvent(stored.getReception(), input.getReception()));

        return rsvpRepository.save(stored);
    }

    private GuestInfo mergeGuestInfo(GuestInfo stored, GuestInfo input) {
        String name = (input != null && input.name() != null)
                      ? input.name().trim()
                      : (stored != null && stored.name() != null ? stored.name().trim() : "");
        if (name.isEmpty()) {
            throw new IllegalArgumentException("Primary contact name must not be null or empty.");
        }
        String email = (input != null && input.email() != null)
                       ? input.email().trim()
                       : (stored != null && stored.email() != null ? stored.email().trim() : "");
        String phone = (input != null && input.phoneNumber() != null)
                       ? input.phoneNumber().trim()
                       : (stored != null && stored.phoneNumber() != null ? stored.phoneNumber().trim() : "");
        String address = (input != null && input.address() != null)
                         ? input.address().trim()
                         : (stored != null && stored.address() != null ? stored.address().trim() : "");
        return new GuestInfo(name, email, phone, address);
    }

    private Map<String, RsvpGuestDetails> mergeGuestList(Map<String, RsvpGuestDetails> stored, Map<String, RsvpGuestDetails> input) {
        return Objects.requireNonNullElseGet(input, () -> Objects.requireNonNullElseGet(stored, HashMap::new));
    }

    private Event mergeEvent(Event stored, Event input) {
        int allowed = 0;
        if (input == null && stored != null) {
            allowed = Math.max(stored.allowedGuests(), 0);
        } else if (stored == null && input != null) {
            allowed = Math.max(input.allowedGuests(), 0);
        }

        List<String> guests;
        if (input != null && input.guestsAttending() != null) {
            guests = input.guestsAttending();
        } else if (stored != null && stored.guestsAttending() != null) {
            guests = stored.guestsAttending();
        } else {
            guests = List.of();
        }

        return new Event(allowed, guests);
    }

    @Transactional
    public void delete(String rsvpId) {
        if (rsvpId == null || rsvpId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid RSVP ID provided.");
        }
        if (!rsvpRepository.existsById(rsvpId)) {
            throw new IllegalArgumentException("RSVP object not found.");
        }
        rsvpRepository.deleteById(rsvpId);
    }

    public Rsvp findRsvpById(String id) {
        return rsvpRepository.findById(id)
                             .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));
    }

    /**
     * Helper method that normalizes a name.
     */
    private String formatName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be null or empty.");
        }
        // Normalize whitespace and convert to lowercase.
        return String.join(" ", name.split("\\s+")).toLowerCase();
    }
}
