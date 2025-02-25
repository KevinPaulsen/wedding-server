package com.paulsen.wedding.service;

import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import com.paulsen.wedding.util.StringFormatUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static com.paulsen.wedding.util.StringFormatUtil.formatFullName;
import static com.paulsen.wedding.util.StringFormatUtil.strip;

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
    public Rsvp saveRsvp(Rsvp input, GuestChangeCallback addGuest, GuestChangeCallback removeGuest) {
        // Obtain the stored object; if no ID, create a new one.
        Rsvp stored = (input.getRsvpId() == null || input.getRsvpId().trim().isEmpty())
                      ? new Rsvp()
                      : rsvpRepository.findById(input.getRsvpId())
                                      .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));

        Set<String> beforeNames = stored.getGuestList() == null ? new HashSet<>() : new HashSet<>(stored.getGuestList().keySet());

        // For booleans (submitted), always override.
        stored.setSubmitted(input.isSubmitted());

        // Merge primary_contact.
        WeddingPrimaryContact mergedPrimary = mergeGuestInfo(stored.getPrimaryContact(), input.getPrimaryContact());
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
                throw new IllegalArgumentException("Name " + name + " is not the guest list.");
            }
        }

        stored = rsvpRepository.save(stored);

        if (addGuest == null || removeGuest == null) {
            return stored;
        }

        // Link any guests that were added
        for (String name : stored.getGuestList().keySet()) {
            if (beforeNames.contains(name)) {
                beforeNames.remove(name);
            } else {
                addGuest.callback(name, stored.getRsvpId());
            }
        }

        // Unlink any guests that were removed
        for (String name : beforeNames) {
            removeGuest.callback(name, stored.getRsvpId());
        }

        return stored;
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

    private WeddingPrimaryContact mergeGuestInfo(WeddingPrimaryContact stored, WeddingPrimaryContact input) {
        String name = (input != null && input.getName() != null)
                      ? formatFullName(input.getName())
                      : (stored != null && stored.getName() != null ? formatFullName(stored.getName()) : "");
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
        return new WeddingPrimaryContact(name, email, phone, address);
    }

    private Map<String, RsvpGuestDetails> mergeGuestList(Map<String, RsvpGuestDetails> stored, Map<String, RsvpGuestDetails> input) {
        Map<String, RsvpGuestDetails> result =  Objects.requireNonNullElseGet(input, () -> Objects.requireNonNullElseGet(stored, HashMap::new));

        for (RsvpGuestDetails details : result.values()) {
            // Note that strip ensures non-empty &
            details.setDisplayName(strip(details.getDisplayName()));
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
            guests = input.getGuestsAttending().stream().map(StringFormatUtil::formatFullName).toList();
        } else if (stored != null && stored.getGuestsAttending() != null) {
            guests = stored.getGuestsAttending().stream().map(StringFormatUtil::formatFullName).toList();
        } else {
            guests = List.of();
        }

        return new Event(allowed, guests);
    }

    @Transactional
    public void delete(String rsvpId, GuestChangeCallback removeGuest) {
        if (rsvpId == null || rsvpId.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid RSVP ID provided.");
        }

        Rsvp deleted = findRsvpById(rsvpId);

        rsvpRepository.deleteById(rsvpId);

        for (String name : deleted.getGuestList().keySet()) {
            removeGuest.callback(name, deleted.getRsvpId());
        }
    }

    public Rsvp findRsvpById(String id) {
        return rsvpRepository.findById(id)
                             .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));
    }

    public void addGuest(String fullName, String displayName, String rsvpId) {
        if (rsvpId == null || rsvpId.trim().isEmpty() || fullName == null || fullName.trim().isEmpty() || displayName == null || displayName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name and RsvpId must not be null or empty.");
        }

        Rsvp rsvp = findRsvpById(rsvpId);

        if (rsvp.getGuestList() == null) {
            throw new IllegalArgumentException("RSVP object has null Guest List.");
        }

        rsvp.getGuestList().putIfAbsent(fullName, new RsvpGuestDetails(displayName, Collections.emptyList(), ""));

        rsvpRepository.save(rsvp);
    }

    public void removeGuest(String fullName, String rsvpId) {
        if (rsvpId == null || rsvpId.trim().isEmpty() || fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name and RsvpId must not be null or empty.");
        }

        Rsvp rsvp = findRsvpById(rsvpId);

        if (rsvp.getGuestList() == null) {
            throw new IllegalArgumentException("RSVP object has null Guest List.");
        }

        rsvp.getGuestList().remove(fullName);

        rsvpRepository.save(rsvp);
    }

    public interface GuestChangeCallback {
        void callback(String name, String rsvpId);
    }
}
