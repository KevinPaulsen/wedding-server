package com.paulsen.wedding.service;

import static com.paulsen.wedding.util.StringFormatUtil.formatRsvpCode;
import static com.paulsen.wedding.util.StringFormatUtil.formatToIndexName;
import static com.paulsen.wedding.util.StringFormatUtil.strip;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.paulsen.wedding.model.rsvp.CreateRsvpDTO;
import com.paulsen.wedding.model.rsvp.Event;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.rsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.repositories.RsvpRepository;
import com.paulsen.wedding.repositories.WeddingGuestRepository;
import com.paulsen.wedding.util.StringFormatUtil;
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
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service class for managing RSVP records in the wedding application.
 * <p>
 * This class handles the creation, update, deletion, and import of RSVPs.
 * It processes guest lists, links/unlinks wedding guests with RSVP records,
 * merges updates from user inputs with stored data, and validates data consistency.
 * <p>
 * The service interacts with {@code RsvpRepository} for RSVP data persistence
 * and {@code WeddingGuestRepository} for managing associated wedding guest records.
 */
@Service
public class RsvpService {

  // Constants for configuration and CSV processing.

  /** A static RSVP code generated from a configured string. */
  private static final String RSVP_CODE = formatRsvpCode("CHRYSOSTOM");

  /** Pattern to match guest column headers (e.g., "guest1", "guest 2", etc.) in CSV files. */
  private static final Pattern GUEST_COLUMN_PATTERN = Pattern.compile("guest\\s*\\d+",
      Pattern.CASE_INSENSITIVE);

  // CSV header names for primary contact and invitation details.
  private static final String PRIMARY_CONTACT_HEADER = "name of primary contact";
  private static final String ADDRESS_HEADER = "address";
  private static final String PHONE_NUMBER_HEADER = "phone number";
  private static final String EMAIL_HEADER = "email";
  private static final String ROCE_HEADER = "roce";
  private static final String REHEARSAL_HEADER = "rehearsal dinner";
  private static final String CEREMONY_HEADER = "ceremony";
  private static final String RECEPTION_HEADER = "reception";

  private final RsvpRepository rsvpRepository;
  private final WeddingGuestRepository weddingGuestRepository;

  /**
   * Constructor to inject repository dependencies.
   *
   * @param rsvpRepository         the repository for RSVP records
   * @param weddingGuestRepository the repository for wedding guest records
   */
  public RsvpService(RsvpRepository rsvpRepository, WeddingGuestRepository weddingGuestRepository) {
    this.rsvpRepository = rsvpRepository;
    this.weddingGuestRepository = weddingGuestRepository;
  }

  /**
   * Sanitizes the guest list in the provided RSVP by normalizing guest display names and
   * updating any references to the guests in events and the primary contact.
   * <p>
   * The method builds a renaming map if any guest name does not match the expected index format.
   * It then applies the renaming to all events and the primary contact, ensuring consistency.
   *
   * @param rsvp the RSVP object to sanitize
   */
  private static void sanitize(Rsvp rsvp) {
    if (rsvp == null || rsvp.getGuestList() == null || rsvp.getGuestList().isEmpty()) {
      return;
    }

    Map<String, RsvpGuestDetails> guestDetails = rsvp.getGuestList();
    Map<String, String> renamingMap = new HashMap<>();

    // Normalize guest display names and determine if renaming is needed.
    for (Entry<String, RsvpGuestDetails> entry : guestDetails.entrySet()) {
      RsvpGuestDetails details = entry.getValue();
      details.setDisplayName(strip(details.getDisplayName()));
      String correctIndexName = formatToIndexName(details.getDisplayName());
      if (!entry.getKey().equals(correctIndexName)) {
        renamingMap.put(entry.getKey(), correctIndexName);
      }
    }

    // Update guest names in all events based on the renaming map.
    for (Event event : rsvp.getNonNullEvents()) {
      if (event == null || event.getGuestsAttending() == null) {
        continue;
      }
      List<String> updatedGuestList = event.getGuestsAttending().stream()
          .map(guest -> renamingMap.getOrDefault(guest, guest))
          .toList();
      event.setGuestsAttending(updatedGuestList);
    }

    // Apply renaming in the guest list.
    for (String wrongKey : renamingMap.keySet()) {
      String correctKey = renamingMap.get(wrongKey);
      if (guestDetails.containsKey(correctKey)) {
        throw new InvalidRsvpInputException(
            "Name " + correctKey + " is a duplicate in the guest list.");
      }
      guestDetails.put(correctKey, guestDetails.get(wrongKey));
      guestDetails.remove(wrongKey);
    }

    // Update primary contact name if needed.
    if (renamingMap.containsKey(rsvp.getPrimaryContact().getName())) {
      rsvp.getPrimaryContact().setName(renamingMap.get(rsvp.getPrimaryContact().getName()));
    }
  }

  /**
   * Retrieves all RSVP records from the repository.
   *
   * @return a list of all RSVPs
   */
  public List<Rsvp> allRsvps() {
    List<Rsvp> rsvps = new ArrayList<>();
    rsvpRepository.findAll().forEach(rsvps::add);
    return rsvps;
  }

  /**
   * Saves (creates or updates) an RSVP record by merging the provided input with the stored record.
   * <p>
   * The method supports either merging the guest list or completely overwriting it.
   * It updates the submission status, primary contact, and associated event data accordingly.
   * Finally, it processes guest linking for any new or removed guests.
   *
   * @param rsvpInput           the incoming RSVP object with updated values
   * @param overwriteGuestList  if {@code true}, the guest list is overwritten; if {@code false}, it is merged
   * @return the saved and updated RSVP object
   */
  @Transactional
  public Rsvp saveRsvp(Rsvp rsvpInput, boolean overwriteGuestList) {
    Rsvp existingRsvp = getOrCreateRsvp(rsvpInput);
    Set<String> previousGuestNames = getExistingGuestNames(existingRsvp);

    // Always override the submitted flag with the incoming value.
    existingRsvp.setSubmitted(rsvpInput.isSubmitted());

    // Merge or overwrite the guest list based on the flag.
    Map<String, RsvpGuestDetails> mergedGuestList;
    if (overwriteGuestList) {
      sanitize(rsvpInput);
      mergedGuestList = overwriteGuestList(existingRsvp.getGuestList(), rsvpInput.getGuestList());
    } else {
      mergedGuestList = mergeGuestList(existingRsvp.getGuestList(), rsvpInput.getGuestList());
    }
    existingRsvp.setGuestList(mergedGuestList);

    // Compute allowed guests (those marked as coming).
    Set<String> allowedGuests = mergedGuestList.entrySet().stream()
        .filter(entry -> entry.getValue().isComing())
        .map(Entry::getKey)
        .collect(Collectors.toSet());

    // Merge primary contact and events.
    WeddingPrimaryContact mergedPrimary = mergeGuestInfo(existingRsvp.getPrimaryContact(),
        rsvpInput.getPrimaryContact(), mergedGuestList.keySet());
    existingRsvp.setPrimaryContact(mergedPrimary);

    existingRsvp.setRoce(mergeEvent(existingRsvp.getRoce(), rsvpInput.getRoce(), allowedGuests));
    existingRsvp.setRehearsal(
        mergeEvent(existingRsvp.getRehearsal(), rsvpInput.getRehearsal(), allowedGuests));
    existingRsvp.setCeremony(
        mergeEvent(existingRsvp.getCeremony(), rsvpInput.getCeremony(), allowedGuests));
    existingRsvp.setReception(
        mergeEvent(existingRsvp.getReception(), rsvpInput.getReception(), allowedGuests));

    // Validate that all guest names in events and primary contact are present in the guest list.
    validateCorrectness(existingRsvp);

    // If the RSVP is marked as submitted, update its submission timestamp.
    if (existingRsvp.isSubmitted()) {
      updateSubmissionTime(existingRsvp);
    }

    // Save the RSVP record.
    existingRsvp = rsvpRepository.save(existingRsvp);

    // Process guest linking: add new links and remove old ones.
    processGuestLinks(existingRsvp, previousGuestNames);

    return existingRsvp;
  }

  /**
   * Retrieves an existing RSVP record by its ID or creates a new one if no valid ID is provided.
   *
   * @param rsvpInput the incoming RSVP object
   * @return the existing RSVP record or a new RSVP object with creation time set
   */
  private Rsvp getOrCreateRsvp(Rsvp rsvpInput) {
    if (rsvpInput.getRsvpId() == null || rsvpInput.getRsvpId().trim().isEmpty()) {
      Rsvp newRsvp = new Rsvp();
      newRsvp.setCreationTime(System.currentTimeMillis());
      return newRsvp;
    }
    return rsvpRepository.findByRsvpId(rsvpInput.getRsvpId())
        .orElseThrow(() -> new RsvpNotFoundException("RSVP object not found."));
  }

  /**
   * Returns the set of guest names that are currently associated with the given RSVP.
   *
   * @param rsvp the RSVP record
   * @return a set containing all guest index names from the RSVP guest list
   */
  private Set<String> getExistingGuestNames(Rsvp rsvp) {
    if (rsvp.getGuestList() == null) {
      return new HashSet<>();
    }
    return new HashSet<>(rsvp.getGuestList().keySet());
  }

  /**
   * Updates the submission time of the RSVP to the current system time.
   *
   * @param rsvp the RSVP record to update
   */
  private void updateSubmissionTime(Rsvp rsvp) {
    rsvp.setLastSubmissionTime(System.currentTimeMillis());
  }

  /**
   * Processes guest links by comparing the current guest list with the previous one.
   * <p>
   * This method creates new guest links for added guests and removes links for guests that were removed.
   *
   * @param rsvp               the current RSVP record
   * @param previousGuestNames the set of guest names before the update
   */
  private void processGuestLinks(Rsvp rsvp, Set<String> previousGuestNames) {
    // Link new guests.
    for (String guestName : rsvp.getGuestList().keySet()) {
      if (previousGuestNames.contains(guestName)) {
        previousGuestNames.remove(guestName);
      } else {
        linkGuestToRsvp(guestName, rsvp.getRsvpId());
      }
    }
    // Unlink guests that were removed.
    for (String removedGuest : previousGuestNames) {
      unlinkGuestFromRsvp(removedGuest, rsvp.getRsvpId());
    }
  }

  /**
   * Validates the correctness of an RSVP record by ensuring that:
   * <ul>
   *   <li>Any guest marked as coming is listed in at least one event.</li>
   *   <li>All names used in events and as the primary contact exist in the guest list.</li>
   * </ul>
   *
   * @param rsvp the RSVP record to validate
   * @throws InvalidRsvpInputException if any inconsistency is found
   */
  private void validateCorrectness(Rsvp rsvp) {
    Set<String> guestsInEvents = rsvp.getNamesInEvents();

    // Ensure that any guest marked as coming is actually listed in an event.
    for (Entry<String, RsvpGuestDetails> guestEntry : rsvp.getGuestList().entrySet()) {
      String indexName = guestEntry.getKey();
      RsvpGuestDetails details = guestEntry.getValue();
      if (details.isComing() && !guestsInEvents.contains(indexName)) {
        details.setComing(false);
      }
    }

    guestsInEvents.add(rsvp.getPrimaryContact().getName());

    // All names used in events and primary contact must exist in the guest list.
    for (String name : guestsInEvents) {
      if (!rsvp.getGuestList().containsKey(name)) {
        throw new InvalidRsvpInputException("Name " + name + " is not in the guest list.");
      }
    }
  }

  /**
   * Deletes an RSVP record by its ID and unlinks all associated guests.
   *
   * @param rsvpId the unique identifier of the RSVP to be deleted
   * @throws InvalidRsvpInputException if the provided RSVP ID is null or empty
   */
  @Transactional
  public void delete(String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty()) {
      throw new InvalidRsvpInputException("Invalid RSVP ID provided.");
    }

    Rsvp deletedRsvp = findRsvpById(rsvpId);
    rsvpRepository.deleteById(rsvpId);

    // Unlink each guest from the deleted RSVP.
    for (String guestName : deletedRsvp.getGuestList().keySet()) {
      unlinkGuestFromRsvp(guestName, rsvpId);
    }
  }

  /**
   * Retrieves an RSVP record by its unique identifier.
   *
   * @param id the unique identifier of the RSVP
   * @return the RSVP record if found
   * @throws RsvpNotFoundException if no RSVP is found with the provided ID
   */
  public Rsvp findRsvpById(String id) {
    return rsvpRepository.findByRsvpId(id)
        .orElseThrow(() -> new RsvpNotFoundException("RSVP object not found."));
  }

  /**
   * Adds a guest to the RSVP's guest list.
   *
   * @param displayName the display name of the guest
   * @param rsvpId      the unique identifier of the RSVP
   * @throws InvalidRsvpInputException if the RSVP ID or display name is null or empty
   */
  @Transactional
  public void addGuest(String displayName, String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty() || displayName == null || displayName.trim().isEmpty()) {
      throw new InvalidRsvpInputException("Name and RSVP ID must not be null or empty.");
    }

    final String indexName = formatToIndexName(displayName);
    Rsvp rsvp = addGuestToRsvp(rsvpId, indexName, displayName);
    linkGuestToRsvp(indexName, rsvpId);
    rsvpRepository.save(rsvp);
  }

  /**
   * Removes a guest from the RSVP's guest list and unlinks the guest.
   *
   * @param fullName the full name of the guest to remove
   * @param rsvpId   the unique identifier of the RSVP
   * @throws InvalidRsvpInputException if the RSVP ID is null or empty
   */
  @Transactional
  public void removeGuest(String fullName, String rsvpId) {
    if (rsvpId == null || rsvpId.trim().isEmpty()) {
      throw new InvalidRsvpInputException("RSVP ID must not be null or empty.");
    }

    final String indexName = formatToIndexName(fullName);
    removeGuestFromRsvp(rsvpId, indexName);
    unlinkGuestFromRsvp(indexName, rsvpId);
  }

  /**
   * Retrieves all wedding guests from the repository.
   *
   * @return a list of all wedding guests
   */
  public List<WeddingGuest> allGuests() {
    List<WeddingGuest> weddingGuests = new ArrayList<>();
    weddingGuestRepository.findAll().forEach(weddingGuests::add);
    return weddingGuests;
  }

  /**
   * Retrieves a wedding guest based on first name, last name, and a provided RSVP code.
   *
   * @param firstName the guest's first name
   * @param lastName  the guest's last name
   * @param rsvpCode  the RSVP code to validate the request
   * @return the WeddingGuest object if found
   * @throws InvalidRsvpInputException if the provided RSVP code is invalid
   * @throws RsvpNotFoundException     if no wedding guest is found matching the name
   */
  public WeddingGuest getGuest(String firstName, String lastName, String rsvpCode) {
    if (!formatRsvpCode(rsvpCode).equals(RSVP_CODE)) {
      throw new InvalidRsvpInputException("Invalid RSVP code provided.");
    }
    String fullName = StringFormatUtil.formatToIndexName(firstName, lastName);
    return weddingGuestRepository.findByFullName(fullName)
        .orElseThrow(() -> new RsvpNotFoundException(
            String.format("RSVP with name %s %s not found", firstName, lastName)));
  }

  /**
   * Retrieves a set of all names involved in the RSVP including the primary contact and all event guest lists.
   *
   * @param rsvp the RSVP record
   * @return a set containing all names from the primary contact and event guest lists
   */
  private Set<String> getAllNames(Rsvp rsvp) {
    Set<String> allNames = new HashSet<>();
    allNames.add(rsvp.getPrimaryContact().getName());
    allNames.addAll(rsvp.getRoce().getGuestsAttending());
    allNames.addAll(rsvp.getRehearsal().getGuestsAttending());
    allNames.addAll(rsvp.getCeremony().getGuestsAttending());
    allNames.addAll(rsvp.getReception().getGuestsAttending());
    return allNames;
  }

  /**
   * Merges primary contact information from stored data and new input.
   * <p>
   * It ensures that the resulting primary contact's name is non-empty and is included in the allowed guest list.
   *
   * @param stored        the existing primary contact information
   * @param input         the new primary contact input
   * @param allowedGuests the set of allowed guest names (from the guest list)
   * @return a merged {@code WeddingPrimaryContact} object with updated information
   * @throws InvalidRsvpInputException if the primary contact name is invalid
   */
  private WeddingPrimaryContact mergeGuestInfo(WeddingPrimaryContact stored,
      WeddingPrimaryContact input, Set<String> allowedGuests) {
    String name = (input != null && input.getName() != null)
        ? formatToIndexName(input.getName())
        : (stored != null && stored.getName() != null ? formatToIndexName(stored.getName()) : "");
    if (name.isEmpty() || !allowedGuests.contains(name)) {
      throw new InvalidRsvpInputException(
          "Primary contact name must be in the guest list and not be null or empty.");
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

  /**
   * Overwrites the stored guest list with the input guest list, applying necessary sanitization.
   *
   * @param stored the current guest list from storage
   * @param input  the new guest list input
   * @return a sanitized guest list to be used for the RSVP record
   */
  private Map<String, RsvpGuestDetails> overwriteGuestList(Map<String, RsvpGuestDetails> stored,
      Map<String, RsvpGuestDetails> input) {
    Map<String, RsvpGuestDetails> result = Objects.requireNonNullElseGet(input,
        () -> Objects.requireNonNullElseGet(stored, HashMap::new));

    for (RsvpGuestDetails details : result.values()) {
      details.setDisplayName(strip(details.getDisplayName()));
    }

    return result;
  }

  /**
   * Merges the stored guest list with the input guest list.
   * <p>
   * For each entry in the input guest list, if the key exists in the stored list, it will be updated after sanitizing
   * the display name.
   *
   * @param stored the current guest list from storage
   * @param input  the new guest list input
   * @return a merged guest list with updated guest details
   */
  private Map<String, RsvpGuestDetails> mergeGuestList(Map<String, RsvpGuestDetails> stored,
      Map<String, RsvpGuestDetails> input) {
    stored = Objects.requireNonNullElse(stored, new HashMap<>());
    input = Objects.requireNonNullElse(input, new HashMap<>());
    Map<String, RsvpGuestDetails> merged = new HashMap<>(stored);

    for (Entry<String, RsvpGuestDetails> entry : input.entrySet()) {
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

  /**
   * Merges event data from stored and input values while filtering out guests that are not allowed.
   * <p>
   * If the event is not marked as invited, a new empty event is returned.
   *
   * @param stored       the stored event data
   * @param input        the input event data
   * @param allowedGuests the set of allowed guest names
   * @return a merged {@code Event} object with updated guest list
   */
  private Event mergeEvent(Event stored, Event input, Set<String> allowedGuests) {
    if (input == null && stored == null) {
      return new Event();
    }

    Boolean isInvited = Objects.requireNonNullElse(input, stored).getInvited();
    if (isInvited == null) {
      isInvited = stored != null && stored.getInvited();
    }
    if (!isInvited) {
      return new Event();
    }

    List<String> guests;
    if (input != null && input.getGuestsAttending() != null) {
      guests = input.getGuestsAttending();
    } else if (stored != null && stored.getGuestsAttending() != null) {
      guests = stored.getGuestsAttending();
    } else {
      guests = List.of();
    }

    guests = guests.stream()
        .map(StringFormatUtil::formatToIndexName)
        .filter(allowedGuests::contains)
        .toList();

    return new Event(isInvited, guests);
  }

  /**
   * Adds a guest to an RSVP record by updating the guest list.
   *
   * @param rsvpId      the unique identifier of the RSVP
   * @param indexName   the formatted (index) name of the guest
   * @param displayName the original display name of the guest
   * @return the updated RSVP record with the guest added
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

  /**
   * Links a guest to an RSVP by updating the wedding guest record.
   * <p>
   * If a wedding guest record does not exist for the given index name, a new record is created.
   * The RSVP ID is appended to the guest's list of RSVP IDs.
   *
   * @param indexName the formatted (index) name of the guest
   * @param rsvpId    the unique identifier of the RSVP
   */
  private void linkGuestToRsvp(String indexName, String rsvpId) {
    WeddingGuest weddingGuest = weddingGuestRepository.findByFullName(indexName)
        .orElse(new WeddingGuest());
    weddingGuest.setFullName(indexName);
    if (weddingGuest.getRsvpIds() == null) {
      weddingGuest.setRsvpIds(List.of(rsvpId));
    } else {
      if (!weddingGuest.getRsvpIds().contains(rsvpId)) {
        List<String> updatedList = new ArrayList<>(weddingGuest.getRsvpIds());
        updatedList.add(rsvpId);
        weddingGuest.setRsvpIds(updatedList);
      }
    }

    weddingGuestRepository.save(weddingGuest);
  }

  /**
   * Removes a guest from an RSVP's guest list.
   * <p>
   * The method also updates event guest lists and, if needed, resets the primary contact.
   *
   * @param rsvpId    the unique identifier of the RSVP
   * @param indexName the formatted (index) name of the guest to remove
   */
  private void removeGuestFromRsvp(String rsvpId, String indexName) {
    Rsvp rsvp = findRsvpById(rsvpId);
    if (rsvp.getGuestList() == null) {
      rsvp.setGuestList(new HashMap<>());
    }
    rsvp.getGuestList().remove(indexName);
    if (rsvp.getPrimaryContact() != null && indexName.equals(rsvp.getPrimaryContact().getName())) {
      rsvp.getPrimaryContact().setName(rsvp.getGuestList().keySet().stream().findAny().orElse(""));
    }
    for (Event event : rsvp.getNonNullEvents()) {
      if (event.getGuestsAttending() == null) {
        continue;
      }
      event.setGuestsAttending(
          event.getGuestsAttending().stream().filter(name -> !name.equals(indexName)).toList());
    }
    rsvpRepository.save(rsvp);
  }

  /**
   * Unlinks a guest from an RSVP by updating the wedding guest record.
   * <p>
   * If the guest has no remaining associated RSVPs, their wedding guest record is deleted.
   *
   * @param indexName the formatted (index) name of the guest
   * @param rsvpId    the unique identifier of the RSVP
   */
  private void unlinkGuestFromRsvp(String indexName, String rsvpId) {
    WeddingGuest weddingGuest = weddingGuestRepository.findByFullName(indexName)
        .orElse(new WeddingGuest());
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
   * The CSV file is expected to have a metadata row (skipped) and then a header row that can be in any order.
   * Each subsequent row is parsed into a {@code CreateRsvpDTO}, which is then converted to an {@code Rsvp}
   * and saved via {@code saveRsvp()}.
   *
   * @param file the CSV file to import
   * @return a success message indicating the number of imported RSVP records
   * @throws RuntimeException if the file cannot be processed or is invalid
   */
  @Transactional
  public String importRsvpsFromCsv(MultipartFile file) {
    int count = 0;
    try (InputStream is = file.getInputStream();
        InputStreamReader isr = new InputStreamReader(is, StandardCharsets.UTF_8);
        CSVReader csvReader = new CSVReader(isr)) {

      // Skip metadata row.
      csvReader.readNext();

      // Read header row.
      String[] header = csvReader.readNext();
      if (header == null || header.length == 0) {
        throw new InvalidRsvpInputException("CSV header row is missing.");
      }

      // Build header map from header names to column indices.
      Map<String, Integer> headerMap = new HashMap<>();
      for (int i = 0; i < header.length; i++) {
        headerMap.put(header[i].trim().toLowerCase(), i);
      }

      String[] row;
      while ((row = csvReader.readNext()) != null) {
        if (row.length == 0) {
          continue;
        }
        CreateRsvpDTO dto = new CreateRsvpDTO();

        // Primary contact fields.
        if (headerMap.containsKey(PRIMARY_CONTACT_HEADER)) {
          int idx = headerMap.get(PRIMARY_CONTACT_HEADER);
          dto.setPrimaryName(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey(ADDRESS_HEADER)) {
          int idx = headerMap.get(ADDRESS_HEADER);
          dto.setAddress(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey(PHONE_NUMBER_HEADER)) {
          int idx = headerMap.get(PHONE_NUMBER_HEADER);
          dto.setPhoneNumber(idx < row.length ? row[idx] : null);
        }
        if (headerMap.containsKey(EMAIL_HEADER)) {
          int idx = headerMap.get(EMAIL_HEADER);
          dto.setEmail(idx < row.length ? row[idx] : null);
        }

        // Event invitations: if the column is missing, assume an invitation is present.
        int roceIdx = headerMap.getOrDefault(ROCE_HEADER, -1);
        dto.setHasRoceInvitation(roceIdx == -1 || convertStringToBoolean(row[roceIdx]));

        int rehearsalIdx = headerMap.getOrDefault(REHEARSAL_HEADER, -1);
        dto.setHasRehearsalInvitation(
            rehearsalIdx == -1 || convertStringToBoolean(row[rehearsalIdx]));

        int ceremonyIdx = headerMap.getOrDefault(CEREMONY_HEADER, -1);
        dto.setHasCeremonyInvitation(ceremonyIdx == -1 || convertStringToBoolean(row[ceremonyIdx]));

        int receptionIdx = headerMap.getOrDefault(RECEPTION_HEADER, -1);
        dto.setHasReceptionInvitation(
            receptionIdx == -1 || convertStringToBoolean(row[receptionIdx]));

        // Process additional guest columns using the defined pattern.
        Set<String> guestNames = new HashSet<>();
        for (int i = 0; i < header.length; i++) {
          String colHeader = header[i].trim();
          if (GUEST_COLUMN_PATTERN.matcher(colHeader).matches() && i < row.length) {
            String guest = row[i];
            if (guest != null && !guest.trim().isEmpty()) {
              guestNames.add(guest.trim());
            }
          }
        }
        dto.setAllowedGuestDisplayNames(guestNames);

        if (!dto.isValid()) {
          continue;
        }

        // Convert DTO to RSVP and save it (overwriting the guest list).
        saveRsvp(dto.toRsvp(), true);
        count++;
      }
    } catch (IOException | CsvValidationException e) {
      throw new RuntimeException("Failed to process CSV file", e);
    }

    return "Successfully imported " + count + " RSVP records.";
  }

  /**
   * Converts a string value (e.g., "yes", "true") to a Boolean.
   * <p>
   * If the input is null or does not match affirmative values, {@code false} is returned.
   *
   * @param value the input string value from the CSV
   * @return {@code true} if the value indicates affirmation, {@code false} otherwise
   */
  private Boolean convertStringToBoolean(String value) {
    if (value == null) {
      return false;
    }
    String trimmed = value.trim();
    return trimmed.equalsIgnoreCase("yes") || trimmed.equalsIgnoreCase("true");
  }

  // Custom Exceptions for domain-specific error handling.

  /**
   * Exception thrown when an RSVP record cannot be found.
   */
  public static class RsvpNotFoundException extends RuntimeException {

    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public RsvpNotFoundException(String message) {
      super(message);
    }
  }

  /**
   * Exception thrown when the provided RSVP input is invalid.
   */
  public static class InvalidRsvpInputException extends RuntimeException {

    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public InvalidRsvpInputException(String message) {
      super(message);
    }
  }
}
