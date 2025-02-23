package com.paulsen.wedding.service;

import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.dto.EventDTO;
import com.paulsen.wedding.model.newRsvp.dto.RsvpDTO;
import com.paulsen.wedding.repositories.NewRsvpRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.Optional;

public class NewRsvpServiceTest {

    private final NewRsvpRepository rsvpRepository = Mockito.mock(NewRsvpRepository.class);
    private final NewRsvpService rsvpService = new NewRsvpService(rsvpRepository);

    // Test successful creation with valid data
    @Test
    public void testCreateRsvp_Success() {
        RsvpDTO dto = new RsvpDTO();
        GuestInfo primary = new GuestInfo("Jane Doe", "jane@example.com", "0987654321", "456 Park Ave");
        dto.setPrimary_contact(primary);
        dto.setGuest_list(Collections.emptyMap());

        EventDTO event = new EventDTO();
        event.setAllowed_guests(3);
        event.setGuests_attending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp savedRsvp = new Rsvp();
        savedRsvp.setRsvpId("67890");
        Mockito.when(rsvpRepository.save(Mockito.any(Rsvp.class))).thenReturn(savedRsvp);

        Rsvp result = rsvpService.saveRsvp(dto);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("67890", result.getRsvpId());
    }

    // Test creation failure when primary contact is missing
    @Test
    public void testCreateRsvp_MissingPrimaryContact() {
        RsvpDTO dto = new RsvpDTO();
        // Primary contact is not set
        dto.setGuest_list(Collections.emptyMap());
        EventDTO event = new EventDTO();
        event.setAllowed_guests(3);
        event.setGuests_attending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto);
        });
        Assertions.assertEquals("Primary contact and name are required.", exception.getMessage());
    }

    // Test successful update with valid input
    @Test
    public void testUpdateRsvp_Success() {
        RsvpDTO dto = new RsvpDTO();
        dto.setRsvp_id("12345");
        GuestInfo updatedPrimary = new GuestInfo("Updated Name", "update@example.com", "1112223333", "789 New St");
        dto.setPrimary_contact(updatedPrimary);
        dto.setGuest_list(Collections.emptyMap());

        EventDTO event = new EventDTO();
        event.setAllowed_guests(5);
        event.setGuests_attending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp existingRsvp = new Rsvp();
        existingRsvp.setRsvpId("12345");
        existingRsvp.setPrimaryContact(new GuestInfo("Old Name", "old@example.com", "0000000000", "Old Address"));
        Mockito.when(rsvpRepository.findById("12345")).thenReturn(Optional.of(existingRsvp));
        Mockito.when(rsvpRepository.save(Mockito.any(Rsvp.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Rsvp result = rsvpService.saveRsvp(dto);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Updated Name", result.getPrimaryContact().name());
        Assertions.assertEquals("update@example.com", result.getPrimaryContact().email());
    }

    // Test update failure when RSVP id is missing
    @Test
    public void testUpdateRsvp_MissingRsvpId() {
        RsvpDTO dto = new RsvpDTO();
        // rsvp_id is not set
        GuestInfo primary = new GuestInfo("Test", "test@example.com", "123", "Test Address");
        dto.setPrimary_contact(primary);
        dto.setGuest_list(Collections.emptyMap());
        EventDTO event = new EventDTO();
        event.setAllowed_guests(2);
        event.setGuests_attending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto);
        });
        Assertions.assertEquals("RSVP id is required for update.", exception.getMessage());
    }

    // Test update failure when the RSVP does not exist
    @Test
    public void testUpdateRsvp_NonExistentRsvp() {
        RsvpDTO dto = new RsvpDTO();
        dto.setRsvp_id("nonexistent");
        GuestInfo primary = new GuestInfo("Test", "test@example.com", "123", "Test Address");
        dto.setPrimary_contact(primary);
        dto.setGuest_list(Collections.emptyMap());
        EventDTO event = new EventDTO();
        event.setAllowed_guests(2);
        event.setGuests_attending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Mockito.when(rsvpRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.saveRsvp(dto);
        });
        Assertions.assertEquals("RSVP object not found.", exception.getMessage());
    }

    // Test successful deletion of an RSVP
    @Test
    public void testDeleteRsvp_Success() {
        String rsvpId = "12345";
        Mockito.when(rsvpRepository.existsById(rsvpId)).thenReturn(true);

        rsvpService.delete(rsvpId);
        Mockito.verify(rsvpRepository, Mockito.times(1)).deleteById(rsvpId);
    }

    // Test deletion failure when RSVP id is invalid
    @Test
    public void testDeleteRsvp_InvalidId() {
        String rsvpId = "";
        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.delete(rsvpId);
        });
        Assertions.assertEquals("Invalid RSVP ID provided.", exception.getMessage());
    }

    // Test deletion failure when the RSVP does not exist
    @Test
    public void testDeleteRsvp_NonExistent() {
        String rsvpId = "nonexistent";
        Mockito.when(rsvpRepository.existsById(rsvpId)).thenReturn(false);

        Exception exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            rsvpService.delete(rsvpId);
        });
        Assertions.assertEquals("RSVP object not found.", exception.getMessage());
    }
}
