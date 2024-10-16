package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.rsvp.AddRsvpDto;
import com.paulsen.wedding.model.rsvp.PutRsvpDto;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.service.RsvpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RsvpControllerTest {

    @Mock
    private RsvpService rsvpService;

    @InjectMocks
    private RsvpController rsvpController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister() {
        AddRsvpDto addRsvpDto = new AddRsvpDto();
        Rsvp mockRsvp = new Rsvp();
        when(rsvpService.createRsvp(any(AddRsvpDto.class))).thenReturn(mockRsvp);

        ResponseEntity<Rsvp> response = rsvpController.register(addRsvpDto);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockRsvp, response.getBody());
    }

    @Test
    void testUpdate() {
        PutRsvpDto putRsvpDto = new PutRsvpDto();
        Rsvp mockRsvp = new Rsvp();
        when(rsvpService.updateRsvp(any(PutRsvpDto.class))).thenReturn(mockRsvp);

        ResponseEntity<Rsvp> response = rsvpController.update(putRsvpDto);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockRsvp, response.getBody());
    }

    @Test
    void testAuthenticatedUser() {
        String rsvpCode = "testCode";
        String lastname = "Doe";
        Rsvp mockRsvp = new Rsvp();
        when(rsvpService.findMatchingRsvp(rsvpCode, lastname)).thenReturn(mockRsvp);

        ResponseEntity<Rsvp> response = rsvpController.authenticatedUser(rsvpCode, lastname);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockRsvp, response.getBody());
    }

    @Test
    void testGetAllRsvps() {
        List<Rsvp> mockRsvpList = new ArrayList<>();
        when(rsvpService.allRsvps()).thenReturn(mockRsvpList);

        ResponseEntity<List<Rsvp>> response = rsvpController.getAllRsvps();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockRsvpList, response.getBody());
    }

    @Test
    void testDelete() {
        String rsvpCode = "testCode";

        ResponseEntity<Void> response = rsvpController.delete(rsvpCode);

        assertEquals(204, response.getStatusCode().value());
    }
}
