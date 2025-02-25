package com.paulsen.wedding.service;

import com.paulsen.wedding.model.rsvp.Event;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.rsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.repositories.RsvpRepository;
import com.paulsen.wedding.repositories.WeddingGuestRepository;
import com.paulsen.wedding.util.StringFormatUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RsvpServiceTest {

    private static final String PRIMARY_GUEST_KEY = StringFormatUtil.formatToIndexName("John Doe");
    @Mock private RsvpRepository rsvpRepository;
    @Mock private WeddingGuestRepository weddingGuestRepository;
    @InjectMocks private RsvpService rsvpService;

    @BeforeEach public void setUp() {
        // Any common setup can be done here if needed.
    }

    /* --- allRsvps() Tests --- */

    @Test public void testAllRsvpsEmpty() {
        when(rsvpRepository.findAll()).thenReturn(Collections.emptyList());
        List<Rsvp> rsvps = rsvpService.allRsvps();
        assertNotNull(rsvps, "Returned list should not be null.");
        assertTrue(rsvps.isEmpty(), "Returned list should be empty.");
    }

    @Test public void testAllRsvpsNonEmpty() {
        Rsvp rsvp = createTestRsvp("rsvp1");
        when(rsvpRepository.findAll()).thenReturn(List.of(rsvp));
        List<Rsvp> rsvps = rsvpService.allRsvps();
        assertNotNull(rsvps);
        assertEquals(1, rsvps.size());
        assertNotNull(rsvps.get(0));
    }

    /* --- saveRsvp() Tests --- */

    @Test public void testSaveRsvp_NewRsvp() {
        // Create a new RSVP with valid fields.
        Rsvp input = new Rsvp();
        WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe",
                                                                  "john@example.com",
                                                                  "1234567890",
                                                                  "123 Main St");
        input.setPrimaryContact(primary);
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"),
                      new RsvpGuestDetails("John Doe", new ArrayList<>(), ""));
        input.setGuestList(guestList);
        // Set an event that refers to the guest.
        input.setCeremony(new Event(1, List.of("John Doe")));

        when(rsvpRepository.save(any(Rsvp.class))).thenAnswer(invocation -> {
            Rsvp arg = invocation.getArgument(0);
            arg.setRsvpId("newRsvpId");
            return arg;
        });

        Rsvp saved = rsvpService.saveRsvp(input);
        assertNotNull(saved);
        verify(rsvpRepository).save(any(Rsvp.class));

        // Verify that any new guest added in the guestList gets inserted into the WeddingGuestRepository.
        // (Implementation-dependent: here we assume the service calls weddingGuestRepository.save() appropriately.)
        verify(weddingGuestRepository, atLeast(1)).save(any(WeddingGuest.class));
    }

    @Test public void testSaveRsvp_ExistingMerge() {
        // Stored RSVP with initial values.
        Rsvp stored = createTestRsvp("existingRsvp");
        stored.getPrimaryContact().setEmail("old@example.com");
        stored.getPrimaryContact().setPhoneNumber("1111111111");
        Map<String, RsvpGuestDetails> storedGuestList = new HashMap<>();
        storedGuestList.put(StringFormatUtil.formatToIndexName("John Doe"),
                            new RsvpGuestDetails("John Doe", new ArrayList<>(), "Old Other"));
        stored.setGuestList(storedGuestList);

        // Simulate stored RSVP found by repository.
        when(rsvpRepository.findByRsvpId("existingRsvp")).thenReturn(Optional.of(stored));

        // Input RSVP that overrides some fields and adds a new guest.
        Rsvp input = new Rsvp();
        input.setRsvpId("existingRsvp");
        input.setPrimaryContact(new WeddingPrimaryContact("John Doe", "new@example.com", null, null));

        Map<String, RsvpGuestDetails> inputGuestList = new HashMap<>();
        inputGuestList.put(StringFormatUtil.formatToIndexName("John Doe"),
                           new RsvpGuestDetails("John Doe", new ArrayList<>(), "New Other"));
        // Add a new guest that wasn’t in the stored object.
        inputGuestList.put(StringFormatUtil.formatToIndexName("Jane Doe"),
                           new RsvpGuestDetails("Jane Doe", null, null));
        input.setGuestList(inputGuestList);

        // Include an event listing both guests.
        input.setRehearsal(new Event(2, Arrays.asList("John Doe", "Jane Doe")));

        when(rsvpRepository.save(any(Rsvp.class))).thenAnswer(invocation -> invocation.getArgument(0));
        Rsvp result = rsvpService.saveRsvp(input);
        assertNotNull(result);

        // Verify merge: non-null email replaced, while phone number remains unchanged.
        assertEquals("new@example.com", result.getPrimaryContact().getEmail());
        assertEquals("1111111111", result.getPrimaryContact().getPhoneNumber());

        // Verify new guest added.
        assertTrue(result.getGuestList().containsKey(StringFormatUtil.formatToIndexName("Jane Doe")));
        // Verify update for existing guest details.
        assertEquals("New Other", result.getGuestList().get(StringFormatUtil.formatToIndexName("John Doe")).getOther());

        // Verify that new guest is inserted into WeddingGuestRepository.
        verify(weddingGuestRepository, atLeast(1)).save(argThat(guest -> guest.getFullName()
                                                                              .equals(StringFormatUtil.formatToIndexName(
                                                                                      "Jane Doe"))));
    }

    @Test public void testSaveRsvp_InvalidPrimaryContactName() {
        // Input RSVP with empty primary contact name.
        Rsvp input = new Rsvp();
        input.setRsvpId("invalidRsvp");
        WeddingPrimaryContact primary = new WeddingPrimaryContact("", "email@example.com", "1234567890", "123 Main St");
        input.setPrimaryContact(primary);
        input.setGuestList(new HashMap<>()); // Even if guest list exists, primary contact is invalid.

        assertThrows(IllegalArgumentException.class, () -> rsvpService.saveRsvp(input));
    }

    @Test public void testSaveRsvp_GuestMissingInList() {
        // Input RSVP where primary contact name is not present in the guest list.
        Rsvp input = new Rsvp();
        input.setRsvpId("missingGuest");
        WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe",
                                                                  "john@example.com",
                                                                  "1234567890",
                                                                  "123 Main St");
        input.setPrimaryContact(primary);
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        // Wrong guest provided.
        guestList.put(StringFormatUtil.formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null));
        input.setGuestList(guestList);
        input.setCeremony(new Event(1, List.of("John Doe")));

        assertThrows(IllegalArgumentException.class, () -> rsvpService.saveRsvp(input));
    }

    /* --- delete() Tests --- */

    @Test public void testDeleteRsvp() {
        // Create a test RSVP with two guests.
        Rsvp rsvp = createTestRsvp("deleteRsvp");
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null));
        guestList.put(StringFormatUtil.formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null));
        rsvp.setGuestList(guestList);

        when(rsvpRepository.findByRsvpId("deleteRsvp")).thenReturn(Optional.of(rsvp));

        // Invoke deletion.
        rsvpService.delete("deleteRsvp");

        // Verify that the RSVP was removed.
        verify(rsvpRepository).deleteById("deleteRsvp");
        // Verify that for each guest the weddingGuestRepository is updated accordingly.
        verify(weddingGuestRepository, atLeast(1)).findByFullName(anyString());
    }

    @Test public void testDeleteRsvp_InvalidInput() {
        assertThrows(IllegalArgumentException.class, () -> rsvpService.delete(null));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.delete("  "));
    }

    /* --- findRsvpById() Tests --- */

    @Test public void testFindRsvpByIdFound() {
        Rsvp rsvp = createTestRsvp("findRsvp");
        when(rsvpRepository.findByRsvpId("findRsvp")).thenReturn(Optional.of(rsvp));

        Rsvp result = rsvpService.findRsvpById("findRsvp");
        assertNotNull(result);
        assertEquals("findRsvp", result.getRsvpId());
    }

    @Test public void testFindRsvpByIdNotFoundOrInvalid() {
        when(rsvpRepository.findByRsvpId("nonexistent")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> rsvpService.findRsvpById("nonexistent"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.findRsvpById(null));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.findRsvpById(" "));
    }

    /* --- addGuest() Tests --- */

    @Test public void testAddGuest_NewGuest() {
        Rsvp rsvp = createTestRsvp("addGuestRsvp");
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null));
        rsvp.setGuestList(guestList);

        when(rsvpRepository.findByRsvpId("addGuestRsvp")).thenReturn(Optional.of(rsvp));

        rsvpService.addGuest("Jane Doe", "addGuestRsvp");

        // Verify guest added to the RSVP.
        assertTrue(rsvp.getGuestList().containsKey(StringFormatUtil.formatToIndexName("Jane Doe")));
        // Verify guest added to the wedding guest repository.
        verify(weddingGuestRepository, atLeast(1)).save(argThat(guest -> guest.getFullName()
                                                                              .equals(StringFormatUtil.formatToIndexName(
                                                                                      "Jane Doe"))));
    }

    @Test public void testAddGuest_ExistingGuest() {
        Rsvp rsvp = createTestRsvp("addExistingGuest");
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null));
        rsvp.setGuestList(guestList);

        when(rsvpRepository.findByRsvpId("addExistingGuest")).thenReturn(Optional.of(rsvp));

        // Attempt to add an already existing guest.
        rsvpService.addGuest("John Doe", "addExistingGuest");

        // Guest list size remains the same.
        assertEquals(1, rsvp.getGuestList().size());
    }

    @Test public void testAddGuest_InvalidInput() {
        assertThrows(IllegalArgumentException.class, () -> rsvpService.addGuest(null, "someId"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.addGuest("  ", "someId"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.addGuest("John Doe", null));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.addGuest("John Doe", " "));
    }

    /* --- removeGuest() Tests --- */

    @Test public void testRemoveGuest_Existing() {
        Rsvp rsvp = createTestRsvp("removeGuestRsvp");
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null));
        guestList.put(StringFormatUtil.formatToIndexName("Jane Doe"), new RsvpGuestDetails("Jane Doe", null, null));
        rsvp.setGuestList(guestList);

        when(rsvpRepository.findByRsvpId("removeGuestRsvp")).thenReturn(Optional.of(rsvp));

        assertTrue(rsvp.getGuestList().containsKey(StringFormatUtil.formatToIndexName("Jane Doe")));
        rsvpService.removeGuest("Jane Doe", "removeGuestRsvp");
        assertFalse(rsvp.getGuestList().containsKey(StringFormatUtil.formatToIndexName("Jane Doe")));

        // Verify that weddingGuestRepository is updated accordingly.
        verify(weddingGuestRepository, atLeast(1)).findByFullName(anyString());
        verify(weddingGuestRepository, atLeast(1)).deleteById("Jane Doe");
    }

    @Test public void testRemoveGuest_NonExistent() {
        Rsvp rsvp = createTestRsvp("removeNonExistentGuest");
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"), new RsvpGuestDetails("John Doe", null, null));
        rsvp.setGuestList(guestList);

        when(rsvpRepository.findByRsvpId("removeNonExistentGuest")).thenReturn(Optional.of(rsvp));

        // Removing a guest that isn't in the RSVP should have no effect.
        rsvpService.removeGuest("Jane Doe", "removeNonExistentGuest");
        assertEquals(1, rsvp.getGuestList().size());
    }

    @Test public void testRemoveGuest_InvalidInput() {
        assertThrows(IllegalArgumentException.class, () -> rsvpService.removeGuest(null, "someId"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.removeGuest("John Doe", null));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.removeGuest(" ", "someId"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.removeGuest("John Doe", "  "));
    }

    /* --- allGuests() Tests --- */

    @Test public void testAllGuests() {
        // Simulate a list of wedding guests.
        List<WeddingGuest> guestList = new ArrayList<>();
        WeddingGuest guest1 = new WeddingGuest();
        guest1.setFullName(PRIMARY_GUEST_KEY);
        guest1.setRsvpIds(null);
        WeddingGuest guest2 = new WeddingGuest();
        guest2.setFullName(StringFormatUtil.formatToIndexName("Jane Doe"));
        guest2.setRsvpIds(null);
        guestList.add(guest1);
        guestList.add(guest2);
        when(weddingGuestRepository.findAll()).thenReturn(guestList);

        List<WeddingGuest> result = rsvpService.allGuests();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(result, guestList);
    }

    /* --- getGuest() Tests --- */

    @Test public void testGetGuestFound() {
        WeddingGuest guest = new WeddingGuest();
        guest.setFullName(PRIMARY_GUEST_KEY);
        guest.setRsvpIds(List.of());
        when(weddingGuestRepository.findByFullName(PRIMARY_GUEST_KEY)).thenReturn(Optional.of(guest));

        WeddingGuest result = rsvpService.getGuest("John", "Doe");
        assertNotNull(result);
        assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
        result = rsvpService.getGuest("jOHN", "dOE");
        assertNotNull(result);
        assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
        result = rsvpService.getGuest("        John           ", "        Doe       ");
        assertNotNull(result);
        assertEquals(PRIMARY_GUEST_KEY, result.getFullName());
    }

    @Test public void testGetGuestNotFoundOrInvalid() {
        when(weddingGuestRepository.findByFullName(PRIMARY_GUEST_KEY)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> rsvpService.getGuest("John", "Doe"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.getGuest(null, "Doe"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.getGuest("John", null));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.getGuest(" ", "Doe"));
        assertThrows(IllegalArgumentException.class, () -> rsvpService.getGuest("John", "  "));
    }

    /* --- Helper Method --- */

    /**
     * Creates a test Rsvp object with a default primary contact, guest list, and event data.
     */
    private Rsvp createTestRsvp(String rsvpId) {
        Rsvp rsvp = new Rsvp();
        rsvp.setRsvpId(rsvpId);
        WeddingPrimaryContact primary = new WeddingPrimaryContact("John Doe",
                                                                  "john@example.com",
                                                                  "1234567890",
                                                                  "123 Main St");
        rsvp.setPrimaryContact(primary);
        Map<String, RsvpGuestDetails> guestList = new HashMap<>();
        guestList.put(StringFormatUtil.formatToIndexName("John Doe"),
                      new RsvpGuestDetails("John Doe", new ArrayList<>(), ""));
        rsvp.setGuestList(guestList);
        // For simplicity, all event fields use the same guest list.
        Event event = new Event(1, List.of("John Doe"));
        rsvp.setRoce(event);
        rsvp.setRehearsal(event);
        rsvp.setCeremony(event);
        rsvp.setReception(event);
        return rsvp;
    }
}
