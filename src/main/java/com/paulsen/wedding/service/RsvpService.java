package com.paulsen.wedding.service;

import static com.paulsen.wedding.util.StringFormatUtil.formatRsvpCode;
import static com.paulsen.wedding.util.StringFormatUtil.formatToIndexName;
import static com.paulsen.wedding.util.StringFormatUtil.strip;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import java.util.regex.Pattern;
import com.paulsen.wedding.model.rsvp.CreateRsvpDTO;
import com.paulsen.wedding.model.rsvp.Event;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.rsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.repositories.RsvpRepository;
import com.paulsen.wedding.repositories.WeddingGuestRepository;
import com.paulsen.wedding.util.StringFormatUtil;
import io.micrometer.core.instrument.binder.system.FileDescriptorMetrics;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RsvpService {

  private static final String RSVP_CODE = formatRsvpCode("CHRYSOSTOM");

  private final RsvpRepository rsvpRepository;
  private final WeddingGuestRepository weddingGuestRepository;

  public RsvpService(RsvpRepository rsvpRepository, WeddingGuestRepository weddingGuestRepository,
      FileDescriptorMetrics fileDescriptorMetrics) {
    this.rsvpRepository = rsvpRepository;
    this.weddingGuestRepository = weddingGuestRepository;
  }

  private static void sanitize(Rsvp input) {
    if (input == null || input.getGuestList() == null || input.getGuestList().isEmpty()) {
      return;
    }

    Map<String, RsvpGuestDetails> guestDetails = input.getGuestList();
    Map<String, String> changingMap = new HashMap<>();

    for (Map.Entry<String, RsvpGuestDetails> entry : guestDetails.entrySet()) {
      entry.getValue().setDisplayName(strip(entry.getValue().getDisplayName()));
      String correctIndexName = formatToIndexName(entry.getValue().getDisplayName());

      if (!entry.getKey().equals(correctIndexName)) {
        changingMap.put(entry.getKey(), correctIndexName);
      }
    }

    for (Event event : input.getNonNullEvents()) {
      if (event == null || event.getGuestsAttending() == null) {
        continue;
      }

      List<String> guestsAttending = event.getGuestsAttending().stream()
          .map(guest -> changingMap.getOrDefault(guest, guest)).toList();
      event.setGuestsAttending(guestsAttending);
    }

    for (String wrongKey : changingMap.keySet()) {
      String correctKey = changingMap.get(wrongKey);
      if (guestDetails.containsKey(correctKey)) {
        throw new IllegalArgumentException(
            "Name " + correctKey + " is a duplicate the guest list.");
      }

      guestDetails.put(correctKey, guestDetails.get(wrongKey));
      guestDetails.remove(wrongKey);
    }

    if (changingMap.containsKey(input.getPrimaryContact().getName())) {
      input.getPrimaryContact().setName(changingMap.get(input.getPrimaryContact().getName()));
    }
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
  public Rsvp saveRsvp(Rsvp input, boolean overwriteGuestList) {
    // Obtain the stored object; if no ID, create a new one.
    Rsvp stored = (input.getRsvpId() == null || input.getRsvpId().trim().isEmpty()) ? new Rsvp()
        : rsvpRepository.findByRsvpId(
                input.getRsvpId())
            .orElseThrow(() -> new IllegalArgumentException(
                "RSVP object not found."));

    Set<String> beforeNames = stored.getGuestList() == null ? new HashSet<>()
        : new HashSet<>(stored.getGuestList().keySet());

    // For booleans (submitted), always override.
    stored.setSubmitted(input.isSubmitted());

    // Merge guest_list.
    Map<String, RsvpGuestDetails> mergedGuestList;
    if (overwriteGuestList) {
      sanitize(input);
      mergedGuestList = overwriteGuestList(stored.getGuestList(), input.getGuestList());
    } else {
      mergedGuestList = mergeGuestList(stored.getGuestList(), input.getGuestList());
    }
    stored.setGuestList(mergedGuestList);

    // Set the allowed guests to be only those in the guest list who have selected they are coming
    Set<String> allowedGuests = mergedGuestList.keySet()
        .stream()
        .filter(guest -> mergedGuestList.get(guest).isComing())
        .collect(Collectors.toSet());

    // Merge primary_contact.
    WeddingPrimaryContact mergedPrimary = mergeGuestInfo(stored.getPrimaryContact(),
        input.getPrimaryContact(), mergedGuestList.keySet());
    stored.setPrimaryContact(mergedPrimary);

    // Merge events.
    stored.setRoce(mergeEvent(stored.getRoce(), input.getRoce(), allowedGuests));
    stored.setRehearsal(mergeEvent(stored.getRehearsal(), input.getRehearsal(), allowedGuests));
    stored.setCeremony(mergeEvent(stored.getCeremony(), input.getCeremony(), allowedGuests));
    stored.setReception(mergeEvent(stored.getReception(), input.getReception(), allowedGuests));

    for (String name : getAllNames(stored)) {
      if (!stored.getGuestList().containsKey(name)) {
        throw new IllegalArgumentException("Name " + name + " is not the guest list.");
      }
    }

    stored = rsvpRepository.save(stored);

    // Link any guests that were added
    for (String indexName : stored.getGuestList().keySet()) {
      if (beforeNames.contains(indexName)) {
        beforeNames.remove(indexName);
      } else {
        linkGuestToRsvp(indexName, stored.getRsvpId());
      }
    }

    // Unlink any guests that were removed
    for (String indexName : beforeNames) {
      unlinkGuestFromRsvp(indexName, stored.getRsvpId());
    }

    return stored;
  }

  @Transactional
  public void delete(String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty()) {
      throw new IllegalArgumentException("Invalid RSVP ID provided.");
    }

    Rsvp deleted = findRsvpById(rsvpId);

    rsvpRepository.deleteById(rsvpId);

    for (String indexName : deleted.getGuestList().keySet()) {
      unlinkGuestFromRsvp(indexName, rsvpId);
    }
  }

  public Rsvp findRsvpById(String id) {
    return rsvpRepository.findByRsvpId(id)
        .orElseThrow(() -> new IllegalArgumentException("RSVP object not found."));
  }

  @Transactional
  public void addGuest(String displayName, String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty() || displayName == null || displayName.trim()
        .isEmpty()) {
      throw new IllegalArgumentException("Name and RsvpId must not be null or empty.");
    }

    final String indexName = formatToIndexName(displayName);

    // Put the indexName in the rsvp object
    Rsvp rsvp = addGuestToRsvp(rsvpId, indexName, displayName);

    // Put the rsvpID in the wedding guest repository
    linkGuestToRsvp(indexName, rsvpId);

    // Save the rsvps
    rsvpRepository.save(rsvp);
  }

  @Transactional
  public void removeGuest(String fullName, String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty()) {
      throw new IllegalArgumentException("RsvpId must not be null or empty.");
    }

    final String indexName = formatToIndexName(fullName);

    removeGuestFromRsvp(rsvpId, indexName);
    unlinkGuestFromRsvp(indexName, rsvpId);
  }

  public List<WeddingGuest> allGuests() {
    List<WeddingGuest> weddingGuests = new ArrayList<>();
    weddingGuestRepository.findAll().forEach(weddingGuests::add);
    return weddingGuests;
  }

  public WeddingGuest getGuest(String firstName, String lastName, String rsvpCode) {
    if (!formatRsvpCode(rsvpCode).equals(RSVP_CODE)) {
      throw new IllegalArgumentException("Invalid RSVP code provided.");
    }

    String fullName = StringFormatUtil.formatToIndexName(firstName, lastName);
    return weddingGuestRepository.findByFullName(fullName)
        .orElseThrow(() -> new IllegalArgumentException( String.format("RSVP with name %s %s not found", firstName, lastName)));
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

  private WeddingPrimaryContact mergeGuestInfo(WeddingPrimaryContact stored,
      WeddingPrimaryContact input, Set<String> allowedGuests) {
    String name = (input != null && input.getName() != null) ? formatToIndexName(input.getName())
        : (stored != null && stored.getName() != null
            ? formatToIndexName(stored.getName()) : "");
    if (name.isEmpty() || !allowedGuests.contains(name)) {
      throw new IllegalArgumentException(
          "Primary contact name must in the guest list, and not be null or empty.");
    }
    String email = (input != null && input.getEmail() != null) ? input.getEmail().trim()
        : (stored != null && stored.getEmail() != null
            ? stored.getEmail().trim() : "");
    String phone =
        (input != null && input.getPhoneNumber() != null) ? input.getPhoneNumber().trim() : (
            stored != null && stored.getPhoneNumber() != null ? stored.getPhoneNumber().trim()
                : "");
    String address = (input != null && input.getAddress() != null) ? input.getAddress().trim()
        : (stored != null && stored.getAddress() != null
            ? stored.getAddress().trim() : "");
    return new WeddingPrimaryContact(name, email, phone, address);
  }

  private Map<String, RsvpGuestDetails> overwriteGuestList(Map<String, RsvpGuestDetails> stored,
      Map<String, RsvpGuestDetails> input) {
    Map<String, RsvpGuestDetails> result = Objects.requireNonNullElseGet(input,
        () -> Objects.requireNonNullElseGet(stored,
            HashMap::new));

    for (RsvpGuestDetails details : result.values()) {
      // Note that strip ensures non-empty &
      details.setDisplayName(strip(details.getDisplayName()));
    }

    return result;
  }

  private Map<String, RsvpGuestDetails> mergeGuestList(Map<String, RsvpGuestDetails> stored,
      Map<String, RsvpGuestDetails> input) {
    stored = Objects.requireNonNullElse(stored, new HashMap<>());
    input = Objects.requireNonNullElse(input, new HashMap<>());
    Map<String, RsvpGuestDetails> merged = new HashMap<>(stored);

    for (Map.Entry<String, RsvpGuestDetails> entry : input.entrySet()) {
      if (!stored.containsKey(entry.getKey())) {
        continue;
      }

      RsvpGuestDetails inputDetails = entry.getValue();
      inputDetails.setDisplayName(strip(inputDetails.getDisplayName()));

      merged.remove(entry.getKey());
      merged.put(formatToIndexName(inputDetails.getDisplayName()), inputDetails);
    }

    return merged;
  }

  private Event mergeEvent(Event stored, Event input, Set<String> allowedGuests) {
    // Ensure at least one of the given events is non-null, if not return the standard Event.
    if (input == null && stored == null) {
      return new Event();
    }

    // Try to get value from input first, then stored, then default to false.
    Boolean isInvited = Objects.requireNonNullElse(input, stored).getInvited();
    if (isInvited == null) {
      isInvited = stored != null && stored.getInvited();
    }

    // If not invited, then return a standard event
    if (!isInvited) {
      return new Event();
    }

    // Try to get guests from input first, then stored, then default to empty list.
    List<String> guests;
    if (input != null && input.getGuestsAttending() != null) {
      guests = input.getGuestsAttending();
    } else if (stored != null && stored.getGuestsAttending() != null) {
      guests = stored.getGuestsAttending();
    } else {
      guests = List.of();
    }

    // Ensure all guests are properly formatted, and filter out names that are not allowed
    guests = guests.stream()
        .map(StringFormatUtil::formatToIndexName)
        .filter(allowedGuests::contains)
        .toList();

    return new Event(isInvited, guests);
  }

  /**
   * Assumes that indexName is properly formatted.
   */
  private Rsvp addGuestToRsvp(String rsvpId, String indexName, String displayName) {
    Rsvp rsvp = findRsvpById(rsvpId);

    if (rsvp.getGuestList() == null) {
      rsvp.setGuestList(new HashMap<>());
    }

    rsvp.getGuestList().putIfAbsent(indexName,
        new RsvpGuestDetails(displayName, Collections.emptyList(), "", true));

    return rsvp;
  }

  private void linkGuestToRsvp(String indexName, String rsvpId) {
    WeddingGuest weddingGuest = weddingGuestRepository.findByFullName(indexName)
        .orElse(new WeddingGuest());
    weddingGuest.setFullName(indexName);
    if (weddingGuest.getRsvpIds() == null) {
      weddingGuest.setRsvpIds(List.of(rsvpId));
    } else {
      weddingGuest.setRsvpIds(
          Stream.concat(weddingGuest.getRsvpIds().stream(), Stream.of(rsvpId)).toList());
    }

    weddingGuestRepository.save(weddingGuest);
  }

  private void removeGuestFromRsvp(String rsvpId, String indexName) {
    Rsvp rsvp = findRsvpById(rsvpId);

    // Remove indexName from guest list
    if (rsvp.getGuestList() == null) {
      rsvp.setGuestList(new HashMap<>());
    }
    rsvp.getGuestList().remove(indexName);

    // Remove indexName from primaryContact if present, replace with other name or "" if guestList is empty now
    if (rsvp.getPrimaryContact() != null && indexName.equals(rsvp.getPrimaryContact().getName())) {
      rsvp.getPrimaryContact().setName(rsvp.getGuestList().keySet().stream().findAny().orElse(""));
    }

    // Remove the guest from any event it might be in
    for (Event event : rsvp.getNonNullEvents()) {
      if (event.getGuestsAttending() == null) {
        continue;
      }

      event.setGuestsAttending(event.getGuestsAttending()
          .stream()
          .filter(name -> !name.equals(indexName))
          .toList());
    }

    rsvpRepository.save(rsvp);
  }

  private void unlinkGuestFromRsvp(String indexName, String rsvpId) {
    WeddingGuest weddingGuest = weddingGuestRepository.findByFullName(indexName)
        .orElse(new WeddingGuest());

    // Remove the rsvpId from the wedding guest
    if (weddingGuest.getRsvpIds() != null) {
      weddingGuest.setRsvpIds(
          weddingGuest.getRsvpIds().stream().filter(id -> !id.equals(rsvpId)).toList());
    }

    if (weddingGuest.getRsvpIds() == null || weddingGuest.getRsvpIds().isEmpty()) {
      weddingGuestRepository.deleteById(indexName);
    } else {
      weddingGuestRepository.save(weddingGuest);
    }
  }

  /**
   * Imports RSVPs from a CSV file with flexible header ordering.
   * <p>
   * Expected CSV format:
   *   - First row is metadata (e.g., "Total Guests Invited =,275") and is skipped.
   *   - Second row is the header. Column names can be in any order.
   *     Expected columns (case-insensitive) include:
   *         "Name of Primary Contact", "Address", "Phone Number", "Email"
   *         and event invitation columns: "Roce", "Rehearsal Dinner", "Ceremony", "Reception".
   *         Any column header matching the regex "Guest\s*\d+" will be treated as an additional guest.
   * <p>
   * For any event column that is not present in the header, the RSVP is assumed to be invited (i.e. true).
   */
  @Transactional
  public String importRsvpsFromCsv(MultipartFile file) {
    int count = 0;

    try (InputStream is = file.getInputStream();
        InputStreamReader isr = new InputStreamReader(is, StandardCharsets.UTF_8);
        com.opencsv.CSVReader csvReader = new CSVReader(isr)) {

      // Skip the first metadata row.
      csvReader.readNext();

      // Read the header row.
      String[] header = csvReader.readNext();
      if (header == null || header.length == 0) {
        throw new IllegalArgumentException("CSV header row is missing.");
      }

      // Build a mapping from lower-cased header name to its column index.
      Map<String, Integer> headerMap = new HashMap<>();
      for (int i = 0; i < header.length; i++) {
        headerMap.put(header[i].trim().toLowerCase(), i);
      }

      // Precompile the guest column regex pattern.
      Pattern guestPattern = Pattern.compile("guest\\s*\\d+", Pattern.CASE_INSENSITIVE);

      // Process each subsequent row.
      String[] row;
      while ((row = csvReader.readNext()) != null) {
        if (row.length == 0) continue; // Skip empty rows.
        CreateRsvpDTO dto = new CreateRsvpDTO();

        // Primary contact fields (if header present, read value; else leave null).
        if (headerMap.containsKey("name of primary contact")) {
          int idx = headerMap.get("name of primary contact");
          dto.setPrimaryName(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey("address")) {
          int idx = headerMap.get("address");
          dto.setAddress(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey("phone number")) {
          int idx = headerMap.get("phone number");
          dto.setPhoneNumber(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey("email")) {
          int idx = headerMap.get("email");
          dto.setEmail(idx < row.length ? row[idx] : null);
        }

        // Event invitations.
        // For each event, if the header is missing, assume invitation = true.
        int roceIdx = headerMap.getOrDefault("roce", -1);
        dto.setHasRoceInvitation(roceIdx == -1 || convertStringToBoolean(row[roceIdx]));

        int rehearsalIdx = headerMap.getOrDefault("rehearsal dinner", -1);
        dto.setHasRehearsalInvitation(rehearsalIdx == -1 || convertStringToBoolean(row[rehearsalIdx]));

        int ceremonyIdx = headerMap.getOrDefault("ceremony", -1);
        dto.setHasCeremonyInvitation(ceremonyIdx == -1 || convertStringToBoolean(row[ceremonyIdx]));

        int receptionIdx = headerMap.getOrDefault("reception", -1);
        dto.setHasReceptionInvitation(receptionIdx == -1 || convertStringToBoolean(row[receptionIdx]));

        // Process any column whose header matches "Guest <number>".
        Set<String> guestNames = new HashSet<>();
        for (int i = 0; i < header.length; i++) {
          // Check if the header at this column matches the guest pattern.
          String colHeader = header[i].trim();
          if (guestPattern.matcher(colHeader).matches() && i < row.length) {
            String guest = row[i];
            if (guest != null && !guest.trim().isEmpty()) {
              guestNames.add(guest.trim());
            }
          }
        }
        dto.setAllowedGuestDisplayNames(guestNames);

        // Convert the DTO to an Rsvp and add to the list.
        saveRsvp(dto.toRsvp(), true);
        count++;
      }
    } catch (IOException | CsvValidationException e) {
      throw new RuntimeException("Failed to process CSV file", e);
    }

    return "Successfully imported " + count + " RSVP records.";
  }

  /**
   * Converts a string value (e.g., "yes", "true", "no", "false") to a Boolean.
   */
  private Boolean convertStringToBoolean(String value) {
    if (value == null) {
      return false;
    }
    String trimmed = value.trim();
    return trimmed.equalsIgnoreCase("yes") || trimmed.equalsIgnoreCase("true");
  }
}
