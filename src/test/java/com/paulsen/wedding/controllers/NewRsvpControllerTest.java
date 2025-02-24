package com.paulsen.wedding.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.service.JwtService;
import com.paulsen.wedding.service.NewRsvpService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NewRsvpController.class)
@AutoConfigureMockMvc(addFilters = false)
public class NewRsvpControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NewRsvpService rsvpService;

    // Add this to satisfy the JwtAuthenticationFilter dependency:
    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    // Test for successful creation of an RSVP
    @Test
    public void testCreateRsvp_Success() throws Exception {
        Rsvp dto = new Rsvp();
        GuestInfo primary = new GuestInfo("John Doe", "john@example.com", "1234567890", "123 Main St");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());

        Event event = new Event();
        event.setAllowedGuests(2);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp createdRsvp = new Rsvp();
        createdRsvp.setRsvpId("12345");

        Mockito.when(rsvpService.saveRsvp(Mockito.any(Rsvp.class), null, null)).thenReturn(createdRsvp);

        mockMvc.perform(post("/new/rsvp/create")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.message").value("RSVP object created successfully."))
               .andExpect(jsonPath("$.rsvp_id").value("12345"));
    }

    // Test for successful update of an RSVP
    @Test
    public void testEditRsvp_Success() throws Exception {
        Rsvp dto = new Rsvp();
        dto.setRsvpId("12345");
        GuestInfo primary = new GuestInfo("Jane Doe", "jane@example.com", "0987654321", "456 Park Ave");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());

        Event event = new Event();
        event.setAllowedGuests(3);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Rsvp updatedRsvp = new Rsvp();
        updatedRsvp.setRsvpId("12345");

        Mockito.when(rsvpService.saveRsvp(Mockito.any(Rsvp.class), null, null)).thenReturn(updatedRsvp);

        mockMvc.perform(put("/new/rsvp/edit")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP object updated successfully."));
    }

    // Test update with invalid input (missing RSVP id)
    @Test
    public void testEditRsvp_InvalidInput() throws Exception {
        Rsvp dto = new Rsvp();
        // Missing rsvp_id
        GuestInfo primary = new GuestInfo("Jane Doe", "jane@example.com", "0987654321", "456 Park Ave");
        dto.setPrimaryContact(primary);
        dto.setGuestList(Collections.emptyMap());
        Event event = new Event();
        event.setAllowedGuests(3);
        event.setGuestsAttending(Collections.emptyList());
        dto.setRoce(event);
        dto.setRehearsal(event);
        dto.setCeremony(event);
        dto.setReception(event);

        Mockito.when(rsvpService.saveRsvp(Mockito.any(Rsvp.class), null, null))
               .thenThrow(new IllegalArgumentException("RSVP id is required for update."));

        mockMvc.perform(put("/new/rsvp/edit")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.error").value("RSVP id is required for update."));
    }

    // Test for successful deletion of an RSVP
    @Test
    public void testDeleteRsvp_Success() throws Exception {
        String rsvpId = "12345";
        Mockito.doNothing().when(rsvpService).delete(rsvpId);

        mockMvc.perform(delete("/new/rsvp/delete")
                                .param("rsvpId", rsvpId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP object deleted successfully."));
    }

    // Test deletion with invalid RSVP ID
    @Test
    public void testDeleteRsvp_InvalidInput() throws Exception {
        String rsvpId = "";
        Mockito.doThrow(new IllegalArgumentException("Invalid RSVP ID provided."))
               .when(rsvpService).delete(rsvpId);

        mockMvc.perform(delete("/new/rsvp/delete")
                                .param("rsvpId", rsvpId))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.error").value("Invalid RSVP ID provided."));
    }

    // Test retrieving all RSVP objects
    @Test
    public void testGetAllRsvps_Success() throws Exception {
        Rsvp rsvp1 = new Rsvp();
        rsvp1.setRsvpId("12345");
        Rsvp rsvp2 = new Rsvp();
        rsvp2.setRsvpId("67890");

        List<Rsvp> rsvpList = List.of(rsvp1, rsvp2);
        Mockito.when(rsvpService.allRsvps()).thenReturn(rsvpList);

        mockMvc.perform(get("/new/rsvp/all"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].rsvp_id").value("12345"))
               .andExpect(jsonPath("$[1].rsvp_id").value("67890"));
    }
}
