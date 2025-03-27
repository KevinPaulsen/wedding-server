package com.paulsen.wedding.service;

import static com.paulsen.wedding.util.StringFormatUtil.formatToIndexName;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.argThat;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.paulsen.wedding.model.rsvp.Event;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.rsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.repositories.RsvpRepository;
import com.paulsen.wedding.repositories.WeddingGuestRepository;
import com.paulsen.wedding.service.RsvpService.InvalidRsvpInputException;
import com.paulsen.wedding.service.RsvpService.RsvpNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Ultimate tests for the public methods of {@link RsvpService}.
 * <p>
 * This test suite covers:
 * <ul>
 *   <li>Retrieval of all RSVP records.</li>
 *   <li>Retrieval by ID (found and not found cases).</li>
 *   <li>Saving new RSVPs and merging existing ones (including validations around primary contact and guest list integrity).</li>
 *   <li>Guest linking behavior: adding guests ensures uniqueness and updating the wedding guest repository accordingly.</li>
 *   <li>Removing guests from an RSVP, including updating/deleting the associated wedding guest record if no RSVP IDs remain.</li>
 *   <li>Deletion of an RSVP and its cascading effects on guest links.</li>
 *   <li>Retrieval of wedding guests and lookup by name with the provided normalization.</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
public class RsvpServiceTest {

  private static final String PRIMARY_GUEST_KEY = formatToIndexName("John Doe");

  @Mock
  private RsvpRepository rsvpRepository;

  @Mock
  private WeddingGuestRepository weddingGuestRepository;

  @InjectMocks
  private RsvpService rsvpService;

  @BeforeEach
  public void setUp() {
    // @InjectMocks creates the RsvpService instance.
  }

  /* --- Helper Methods --- */

  /**
   * Creates a test Rsvp with a default primary contact, guest list, and event data.
   */
  private Rsvp createTestRsvp(String rsvpId) {
    Rsvp rsvp = new Rsvp();
    rsvp.setRsvpId(rsvpId);
    WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe", "john@example.com", "1234567890", "123 Main St");
    rsvp.setPrimaryContact(primary);
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", new ArrayList<>(), "", true));
    rsvp.setGuestList(guestList);
    // For simplicity, all event fields use the same guest list.
    Event event = new Event(true, List.of("John Doe"));
    rsvp.setRoce(event);
    rsvp.setRehearsal(event);
    rsvp.setCeremony(event);
    rsvp.setReception(event);
    return rsvp;
  }

  /**
   * Creates a test WeddingGuest with the given full name and RSVP ids.
   */
  private WeddingGuest createTestWeddingGuest(String fullName, List<String> rsvpIds) {
    WeddingGuest guest = new WeddingGuest();
    guest.setFullName(fullName);
    guest.setRsvpIds(rsvpIds);
    return guest;
  }

  /* --- allRsvps() Tests --- */

  @Test
  public void testAllRsvpsEmpty() {
    when(rsvpRepository.findAll()).thenReturn(Collections.emptyList());
    List<Rsvp> rsvps = rsvpService.allRsvps();
    assertNotNull(rsvps, "Returned list should not be null.");
    assertTrue(rsvps.isEmpty(), "Returned list should be empty.");
  }

  @Test
  public void testAllRsvpsNonEmpty() {
    Rsvp rsvp = createTestRsvp("rsvp1");
    when(rsvpRepository.findAll()).thenReturn(List.of(rsvp));
    List<Rsvp> rsvps = rsvpService.allRsvps();
    assertNotNull(rsvps);
    assertEquals(1, rsvps.size());
    assertNotNull(rsvps.get(0));
  }

  /* --- findRsvpById() Tests --- */

  @Test
  public void testFindRsvpByIdFound() {
    Rsvp rsvp = createTestRsvp("findRsvp");
    when(rsvpRepository.findByRsvpId("findRsvp")).thenReturn(Optional.of(rsvp));

    Rsvp result = rsvpService.findRsvpById("findRsvp");
    assertNotNull(result);
    assertEquals("findRsvp", result.getRsvpId());
  }

  @Test
  public void testFindRsvpByIdNotFound() {
    when(rsvpRepository.findByRsvpId("nonexistent")).thenReturn(Optional.empty());
    assertThrows(RsvpNotFoundException.class, () -> rsvpService.findRsvpById("nonexistent"));
  }

  /* --- saveRsvp() Tests --- */

  @Test
  public void testSaveRsvp_NewRsvp() {
    // Create a new RSVP with valid fields.
    Rsvp input = new Rsvp();
    WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe", "john@example.com", "1234567890", "123 Main St");
    input.setPrimaryContact(primary);
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", new ArrayList<>(), "", true));
    input.setGuestList(guestList);
    // Set an event that refers to the guest.
    input.setCeremony(new Event(true, List.of("John Doe")));

    when(rsvpRepository.save(any(Rsvp.class))).thenAnswer(invocation -> {
      Rsvp arg = invocation.getArgument(0);
      arg.setRsvpId("newRsvpId");
      return arg;
    });

    Rsvp saved = rsvpService.saveRsvp(input, true);
    assertNotNull(saved);
    assertEquals("newRsvpId", saved.getRsvpId());
    verify(rsvpRepository).save(any(Rsvp.class));

    // Verify that weddingGuestRepository.save() is called at least once.
    verify(weddingGuestRepository, atLeast(1)).save(any(WeddingGuest.class));
  }

  @Test
  public void testSaveRsvp_ExistingMerge() {
    // Stored RSVP with initial values.
    Rsvp stored = createTestRsvp("existingRsvp");
    stored.getPrimaryContact().setEmail("old@example.com");
    stored.getPrimaryContact().setPhoneNumber("1111111111");
    Map<String, RsvpGuestDetails> storedGuestList = new HashMap<>();
    storedGuestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", new ArrayList<>(), "Old Other", true));
    stored.setGuestList(storedGuestList);

    when(rsvpRepository.findByRsvpId("existingRsvp")).thenReturn(Optional.of(stored));

    // Input RSVP overrides some fields and adds a new guest.
    Rsvp input = new Rsvp();
    input.setRsvpId("existingRsvp");
    input.setPrimaryContact(new WeddingPrimaryContact("John Doe", "new@example.com", null, null));

    Map<String, RsvpGuestDetails> inputGuestList = new HashMap<>();
    inputGuestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", new ArrayList<>(), "New Other", true));
    // Add a new guest that wasn’t in the stored object.
    inputGuestList.put(formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null, true));
    input.setGuestList(inputGuestList);

    // Include an event listing both guests.
    input.setRehearsal(new Event(true, Arrays.asList("John Doe", "Jane Doe")));

    when(rsvpRepository.save(any(Rsvp.class))).thenAnswer(invocation -> invocation.getArgument(0));
    Rsvp result = rsvpService.saveRsvp(input, true);
    assertNotNull(result);

    // Verify that the primary contact's email is updated while phone number remains unchanged.
    assertEquals("new@example.com", result.getPrimaryContact().getEmail());
    assertEquals("1111111111", result.getPrimaryContact().getPhoneNumber());

    // Verify new guest added.
    assertTrue(result.getGuestList().containsKey(formatToIndexName("Jane Doe")));
    // Verify update for existing guest details.
    assertEquals("New Other", result.getGuestList().get(formatToIndexName("John Doe")).getOther());

    verify(weddingGuestRepository, atLeast(1)).save(argThat(guest -> guest.getFullName().equals(formatToIndexName("Jane Doe"))));
  }

  @Test
  public void testSaveRsvp_InvalidPrimaryContactName() {
    // Input RSVP with empty primary contact name.
    Rsvp input = new Rsvp();
    WeddingPrimaryContact primary = new WeddingPrimaryContact("temp", "email@example.com", "1234567890", "123 Main St");
    primary.setName("");
    input.setPrimaryContact(primary);
    input.setGuestList(new HashMap<>()); // Guest list exists but primary contact is invalid.
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.saveRsvp(input, true));
  }

  @Test
  public void testSaveRsvp_GuestMissingInList() {
    // Input RSVP where primary contact "John Doe" is not present in the guest list.
    Rsvp input = new Rsvp();
    WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe", "john@example.com", "1234567890", "123 Main St");
    input.setPrimaryContact(primary);
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    // Wrong guest provided.
    guestList.put(formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null, true));
    input.setGuestList(guestList);
    input.setCeremony(new Event(true, List.of("John Doe")));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.saveRsvp(input, true));
  }

  /* --- delete() Tests --- */

  @Test
  public void testDeleteRsvp() {
    // Create a test RSVP with two guests.
    Rsvp rsvp = createTestRsvp("deleteRsvp");
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null, true));
    guestList.put(formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null, true));
    rsvp.setGuestList(guestList);

    when(rsvpRepository.findByRsvpId("deleteRsvp")).thenReturn(Optional.of(rsvp));

    rsvpService.delete("deleteRsvp");

    // Verify that the RSVP is deleted.
    verify(rsvpRepository).deleteById("deleteRsvp");
    // Verify that wedding guest records are processed.
    verify(weddingGuestRepository, atLeast(1)).findByFullName(anyString());
  }

  @Test
  public void testDeleteRsvp_InvalidInput() {
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.delete(null));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.delete("  "));
  }

  /* --- addGuest() Tests --- */

  @Test
  public void testAddGuest_NewGuest() {
    Rsvp rsvp = createTestRsvp("addGuestRsvp");
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null, true));
    rsvp.setGuestList(guestList);

    when(rsvpRepository.findByRsvpId("addGuestRsvp")).thenReturn(Optional.of(rsvp));

    rsvpService.addGuest("Jane Doe", "addGuestRsvp");

    // Verify guest added to the RSVP.
    assertTrue(rsvp.getGuestList().containsKey(formatToIndexName("Jane Doe")));
    // Verify guest added to the wedding guest repository.
    verify(weddingGuestRepository, atLeast(1)).save(argThat(guest -> guest.getFullName().equals(formatToIndexName("Jane Doe"))));
  }

  @Test
  public void testAddGuest_ExistingGuest() {
    Rsvp rsvp = createTestRsvp("addExistingGuest");
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null, true));
    rsvp.setGuestList(guestList);

    when(rsvpRepository.findByRsvpId("addExistingGuest")).thenReturn(Optional.of(rsvp));

    // Adding an already existing guest should not change the guest list.
    rsvpService.addGuest("John Doe", "addExistingGuest");

    assertEquals(1, rsvp.getGuestList().size());
  }

  @Test
  public void testAddGuest_InvalidInput() {
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.addGuest(null, "someId"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.addGuest("  ", "someId"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.addGuest("John Doe", null));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.addGuest("John Doe", " "));
  }

  @Test
  public void testAddGuest_CreatesWeddingGuestAndMaintainsUniqueness() {
    String rsvpId = "rsvpUniq";
    Rsvp rsvp = createTestRsvp(rsvpId);
    when(rsvpRepository.findByRsvpId(rsvpId)).thenReturn(Optional.of(rsvp));
    String normalizedName = formatToIndexName("Alice Smith");
    when(weddingGuestRepository.findByFullName(normalizedName)).thenReturn(Optional.empty());
    when(rsvpRepository.save(any(Rsvp.class))).thenAnswer(i -> i.getArgument(0));
    when(weddingGuestRepository.save(any(WeddingGuest.class))).thenAnswer(i -> i.getArgument(0));

    // Add guest "Alice Smith" twice.
    rsvpService.addGuest("Alice Smith", rsvpId);
    assertTrue(rsvp.getGuestList().containsKey(normalizedName));

    ArgumentCaptor<WeddingGuest> guestCaptor = ArgumentCaptor.forClass(WeddingGuest.class);
    verify(weddingGuestRepository, times(1)).save(guestCaptor.capture());
    WeddingGuest savedGuest = guestCaptor.getValue();
    assertEquals(normalizedName, savedGuest.getFullName());
    assertEquals(1, savedGuest.getRsvpIds().size());
    assertTrue(savedGuest.getRsvpIds().contains(rsvpId));

    // Simulate existing wedding guest record.
    when(weddingGuestRepository.findByFullName(normalizedName)).thenReturn(Optional.of(savedGuest));
    rsvpService.addGuest("Alice Smith", rsvpId);

    verify(weddingGuestRepository, times(2)).save(any(WeddingGuest.class));
    assertEquals(1, savedGuest.getRsvpIds().stream().filter(id -> id.equals(rsvpId)).count());
  }

  /* --- removeGuest() Tests --- */

  @Test
  public void testRemoveGuest_Existing() {
    Rsvp rsvp = createTestRsvp("removeGuestRsvp");
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null, true));
    guestList.put(formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null, true));
    rsvp.setGuestList(guestList);

    when(rsvpRepository.findByRsvpId("removeGuestRsvp")).thenReturn(Optional.of(rsvp));

    assertTrue(rsvp.getGuestList().containsKey(formatToIndexName("Jane Doe")));
    rsvpService.removeGuest("Jane Doe", "removeGuestRsvp");
    assertFalse(rsvp.getGuestList().containsKey(formatToIndexName("Jane Doe")));

    verify(weddingGuestRepository, atLeast(1)).findByFullName(anyString());
    verify(weddingGuestRepository, atLeast(1)).deleteById(formatToIndexName("Jane Doe"));
  }

  @Test
  public void testRemoveGuest_NonExistent() {
    Rsvp rsvp = createTestRsvp("removeNonExistentGuest");
    Map<String, RsvpGuestDetails> guestList = new HashMap<>();
    guestList.put(formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null, true));
    rsvp.setGuestList(guestList);

    when(rsvpRepository.findByRsvpId("removeNonExistentGuest")).thenReturn(Optional.of(rsvp));

    // Removing a guest that isn't in the RSVP should have no effect.
    rsvpService.removeGuest("Jane Doe", "removeNonExistentGuest");
    assertEquals(1, rsvp.getGuestList().size());
  }

  @Test
  public void testRemoveGuest_InvalidInput() {
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.removeGuest(null, "someId"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.removeGuest("John Doe", null));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.removeGuest(" ", "someId"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.removeGuest("John Doe", "  "));
  }

  /* --- allGuests() Tests --- */

  @Test
  public void testAllGuests() {
    List<WeddingGuest> guestList = new ArrayList<>();
    WeddingGuest guest1 = new WeddingGuest();
    guest1.setFullName(PRIMARY_GUEST_KEY);
    guest1.setRsvpIds(null);
    WeddingGuest guest2 = new WeddingGuest();
    guest2.setFullName(formatToIndexName("Jane Doe"));
    guest2.setRsvpIds(null);
    guestList.add(guest1);
    guestList.add(guest2);
    when(weddingGuestRepository.findAll()).thenReturn(guestList);

    List<WeddingGuest> result = rsvpService.allGuests();
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals(guestList, result);
  }

  /* --- getGuest() Tests --- */

  @Test
  public void testGetGuestFound() {
    WeddingGuest guest = new WeddingGuest();
    guest.setFullName(PRIMARY_GUEST_KEY);
    guest.setRsvpIds(List.of());
    when(weddingGuestRepository.findByFullName(PRIMARY_GUEST_KEY)).thenReturn(Optional.of(guest));

    WeddingGuest result = rsvpService.getGuest("John", "Doe", "CHRYSOSTOM");
    assertNotNull(result);
    assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
    // Check with various cases and extra spaces.
    result = rsvpService.getGuest("jOHN", "dOE", "CHRYSOSTOM");
    assertNotNull(result);
    assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
    result = rsvpService.getGuest("        John           ", "        Doe       ", "CHRYSOSTOM");
    assertNotNull(result);
    assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
  }

  @Test
  public void testGetGuestNotFoundOrInvalid() {
    when(weddingGuestRepository.findByFullName(PRIMARY_GUEST_KEY)).thenReturn(Optional.empty());
    assertThrows(RsvpNotFoundException.class, () -> rsvpService.getGuest("John", "Doe", "CHRYSOSTOM"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.getGuest(null, "Doe", "CHRYSOSTOM"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.getGuest("John", null, "CHRYSOSTOM"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.getGuest(" ", "Doe", "CHRYSOSTOM"));
    assertThrows(InvalidRsvpInputException.class, () -> rsvpService.getGuest("John", "  ", "CHRYSOSTOM"));
  }
}
