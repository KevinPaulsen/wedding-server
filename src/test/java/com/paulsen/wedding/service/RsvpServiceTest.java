package com.paulsen.wedding.service;

import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.WeddingPrimaryContact;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.Optional;

;

public class RsvpServiceTest {

    private final NewRsvpRepository rsvpRepository = Mockito.mock(NewRsvpRepository.class);
    private final RsvpService rsvpService = new RsvpService(rsvpRepository);

    // Test successful creation with valid data
    @Test
    public void testCreateRsvp_Success() {
        Rsvp dto = new Rsvp();
        WeddingPrimaryContact primary = new WeddingPrimaryContact("Jane Doe", "jane@example.com", "0987654321", "456 Park Ave");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());

        Event event = new Event();
        event.setAllowedGuests(3);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp savedRsvp = new Rsvp();
        savedRsvp.setRsvpId("67890");
        Mockito.when(rsvpRepository.save(Mockito.any(Rsvp.class))).thenReturn(savedRsvp);

        Rsvp result = rsvpService.saveRsvp(dto, null, null);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("67890", result.getRsvpId());
    }

    // Test creation failure when primary contact is missing
    @Test
    public void testCreateRsvp_MissingPrimaryContact() {
        Rsvp dto = new Rsvp();
        // Primary contact is not set
        dto.setGuestList(Collections.emptyMap());
        Event event = new Event();
        event.setAllowedGuests(3);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto, null, null);
        });
        Assertions.assertEquals("Primary contact and name are required.", exception.getMessage());
    }

    // Test successful update with valid input
    @Test
    public void testUpdateRsvp_Success() {
        Rsvp dto = new Rsvp();
        dto.setRsvpId("12345");
        WeddingPrimaryContact updatedPrimary = new WeddingPrimaryContact("Updated Name", "update@example.com", "1112223333", "789 New St");
        dto.setPrimaryContact(updatedPrimary);
        dto.setGuestList(Collections.emptyMap());

        Event event = new Event();
        event.setAllowedGuests(5);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp existingRsvp = new Rsvp();
        existingRsvp.setRsvpId("12345");
        existingRsvp.setPrimaryContact(new WeddingPrimaryContact("Old Name", "old@example.com", "0000000000", "Old Address"));
        Mockito.when(rsvpRepository.findById("12345")).thenReturn(Optional.of(existingRsvp));
        Mockito.when(rsvpRepository.save(Mockito.any(Rsvp.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Rsvp result = rsvpService.saveRsvp(dto, null, null);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Updated Name", result.getPrimaryContact().getName());
        Assertions.assertEquals("update@example.com", result.getPrimaryContact().getEmail());
    }

    // Test update failure when RSVP id is missing
    @Test
    public void testUpdateRsvp_MissingRsvpId() {
        Rsvp dto = new Rsvp();
        // rsvp_id is not set
        WeddingPrimaryContact primary = new WeddingPrimaryContact("Test", "test@example.com", "123", "Test Address");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());
        Event event = new Event();
        event.setAllowedGuests(2);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto, null, null);
        });
        Assertions.assertEquals("RSVP id is required for update.", exception.getMessage());
    }

    // Test update failure when the RSVP does not exist
    @Test
    public void testUpdateRsvp_NonExistentRsvp() {
        Rsvp dto = new Rsvp();
        dto.setRsvpId("nonexistent");
        WeddingPrimaryContact primary = new WeddingPrimaryContact("Test", "test@example.com", "123", "Test Address");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());
        Event event = new Event();
        event.setAllowedGuests(2);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Mockito.when(rsvpRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto, null, null);
        });
        Assertions.assertEquals("RSVP object not found.", exception.getMessage());
    }

    // Test successful deletion of an RSVP
    @Test
    public void testDeleteRsvp_Success() {
        String rsvpId = "12345";
        Mockito.when(rsvpRepository.existsById(rsvpId)).thenReturn(true);

        rsvpService.delete(rsvpId, null);
        Mockito.verify(rsvpRepository, Mockito.times(1)).deleteById(rsvpId);
    }

    // Test deletion failure when RSVP id is invalid
    @Test
    public void testDeleteRsvp_InvalidId() {
        String rsvpId = "";
        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.delete(rsvpId, null);
        });
        Assertions.assertEquals("Invalid RSVP ID provided.", exception.getMessage());
    }

    // Test deletion failure when the RSVP does not exist
    @Test
    public void testDeleteRsvp_NonExistent() {
        String rsvpId = "nonexistent";
        Mockito.when(rsvpRepository.existsById(rsvpId)).thenReturn(false);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.delete(rsvpId, null);
        });
        Assertions.assertEquals("RSVP object not found.", exception.getMessage());
    }
}
