package com.paulsen.wedding.service;

import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
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
    public Rsvp saveRsvp(Rsvp input) {
        // Obtain the stored object; if no ID, create a new one.
        Rsvp stored = (input.getRsvpId() == null || input.getRsvpId().trim().isEmpty())
                      ? new Rsvp()
                      : rsvpRepository.findById(input.getRsvpId())
                                      .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));

        // For booleans (submitted), always override.
        stored.setSubmitted(input.isSubmitted());

        // Merge primary_contact.
        GuestInfo mergedPrimary = mergeGuestInfo(stored.getPrimaryContact(), input.getPrimaryContact());
        stored.setPrimaryContact(mergedPrimary);

        // Merge guest_list.
        Map<String, RsvpGuestDetails> mergedGuestList = mergeGuestList(stored.getGuestList(), input.getGuestList());
        stored.setGuestList(mergedGuestList);

        // Merge events.
        stored.setRoce(mergeEvent(stored.getRoce(), input.getRoce()));
        stored.setRehearsal(mergeEvent(stored.getRehearsal(), input.getRehearsal()));
        stored.setCeremony(mergeEvent(stored.getCeremony(), input.getCeremony()));
        stored.setReception(mergeEvent(stored.getReception(), input.getReception()));

        for (String name : getAllNames(stored)) {
            if (!stored.getGuestList().containsKey(name)) {
                stored.getGuestList().put(name, new RsvpGuestDetails(Collections.emptyList(), ""));
            }
        }

        return rsvpRepository.save(stored);
    }

    private List<String> getAllNames(Rsvp rsvp) {
        List<String> allNames = new ArrayList<>();

        allNames.add(rsvp.getPrimaryContact().getName());
        allNames.addAll(rsvp.getRoce().getGuestsAttending());
        allNames.addAll(rsvp.getRehearsal().getGuestsAttending());
        allNames.addAll(rsvp.getCeremony().getGuestsAttending());
        allNames.addAll(rsvp.getReception().getGuestsAttending());

        return allNames;
    }

    private GuestInfo mergeGuestInfo(GuestInfo stored, GuestInfo input) {
        String name = (input != null && input.getName() != null)
                      ? formatName(input.getName())
                      : (stored != null && stored.getName() != null ? formatName(stored.getName()) : "");
        if (name.isEmpty()) {
            throw new IllegalArgumentException("Primary contact name must not be null or empty.");
        }
        String email = (input != null && input.getEmail() != null)
                       ? input.getEmail().trim()
                       : (stored != null && stored.getEmail() != null ? stored.getEmail().trim() : "");
        String phone = (input != null && input.getPhoneNumber() != null)
                       ? input.getPhoneNumber().trim()
                       : (stored != null && stored.getPhoneNumber() != null ? stored.getPhoneNumber().trim() : "");
        String address = (input != null && input.getAddress() != null)
                         ? input.getAddress().trim()
                         : (stored != null && stored.getAddress() != null ? stored.getAddress().trim() : "");
        return new GuestInfo(name, email, phone, address);
    }

    private Map<String, RsvpGuestDetails> mergeGuestList(Map<String, RsvpGuestDetails> stored, Map<String, RsvpGuestDetails> input) {
        Map<String, RsvpGuestDetails> merged = Objects.requireNonNullElseGet(input, () -> Objects.requireNonNullElseGet(stored, HashMap::new));
        Map<String, RsvpGuestDetails> result = new HashMap<>();

        for (Map.Entry<String, RsvpGuestDetails> entry : merged.entrySet()) {
            String key = formatName(entry.getKey());

            if (result.containsKey(key)) throw new IllegalArgumentException("Duplicate name (" + key + ") in guest list");

            result.put(formatName(key), entry.getValue());
        }

        return result;
    }

    private Event mergeEvent(Event stored, Event input) {
        int allowed = 0;
        if (input == null && stored != null) {
            allowed = Math.max(stored.getAllowedGuests(), 0);
        } else if (stored == null && input != null) {
            allowed = Math.max(input.getAllowedGuests(), 0);
        }

        List<String> guests;
        if (input != null && input.getGuestsAttending() != null) {
            guests = input.getGuestsAttending().stream().map(this::formatName).toList();
        } else if (stored != null && stored.getGuestsAttending() != null) {
            guests = stored.getGuestsAttending().stream().map(this::formatName).toList();
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
