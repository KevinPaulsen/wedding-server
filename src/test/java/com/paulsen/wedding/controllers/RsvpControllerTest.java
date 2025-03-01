package com.paulsen.wedding.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paulsen.wedding.model.rsvp.CreateRsvpDTO;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.model.weddingGuest.dto.AddGuestDTO;
import com.paulsen.wedding.model.weddingGuest.dto.LookupDTO;
import com.paulsen.wedding.service.JwtService;
import com.paulsen.wedding.service.RsvpService;
import com.paulsen.wedding.util.StringFormatUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RsvpController.class) @AutoConfigureMockMvc(addFilters=false) public class RsvpControllerTest {

    @Autowired private MockMvc mockMvc;

    @Autowired private ObjectMapper objectMapper;

    // Add this to satisfy the JwtAuthenticationFilter dependency:
    @MockBean private JwtService jwtService;

    @MockBean private RsvpService rsvpService;

    /* --- POST /rsvp/create --- */
    @Test public void testCreateRsvp() throws Exception {
        // Create a sample CreateRsvpDTO.
        CreateRsvpDTO createDto = new CreateRsvpDTO();
        // Populate createDto with the minimal fields required (if any)
        // Assume that toRsvp() converts this DTO to a valid Rsvp.
        Rsvp convertedRsvp = new Rsvp();
        convertedRsvp.setRsvpId("test-create-id");
        // Stub the service call regardless of the conversion details.
        when(rsvpService.saveRsvp(any(Rsvp.class), eq(true))).thenReturn(convertedRsvp);

        String jsonRequest = objectMapper.writeValueAsString(createDto);

        mockMvc.perform(post("/rsvp/create").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.message").value("RSVP object created successfully."))
               .andExpect(jsonPath("$.rsvp_id").value("test-create-id"));
    }

    /* --- PUT /rsvp/edit --- */
    @Test public void testEditRsvp() throws Exception {
        Rsvp rsvp = new Rsvp();
        rsvp.setRsvpId("edit-id");
        // Stub service call.
        when(rsvpService.saveRsvp(any(Rsvp.class), eq(true))).thenReturn(rsvp);

        String jsonRequest = objectMapper.writeValueAsString(rsvp);
        mockMvc.perform(put("/rsvp/edit").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP object updated successfully."));
    }

    /* --- DELETE /rsvp/delete --- */
    @Test public void testDeleteRsvp() throws Exception {
        String rsvpId = "delete-id";
        // No return value needed; verify service call later.
        mockMvc.perform(delete("/rsvp/delete").param("rsvpId", rsvpId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP object deleted successfully."));
        verify(rsvpService).delete(rsvpId);
    }

    /* --- POST /rsvp/submit --- */
    @Test public void testSubmitRsvp() throws Exception {
        Rsvp rsvp = new Rsvp();
        rsvp.setRsvpId("submit-id");
        // Note: The controller will clear certain fields before calling saveRsvp.
        when(rsvpService.saveRsvp(any(Rsvp.class), eq(true))).thenReturn(rsvp);
        String jsonRequest = objectMapper.writeValueAsString(rsvp);

        mockMvc.perform(post("/rsvp/submit").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP object updated successfully."));
    }

    /* --- GET /rsvp/all --- */
    @Test public void testGetAllRsvps() throws Exception {
        Rsvp rsvp1 = new Rsvp();
        rsvp1.setRsvpId("id1");
        Rsvp rsvp2 = new Rsvp();
        rsvp2.setRsvpId("id2");
        List<Rsvp> rsvpList = Arrays.asList(rsvp1, rsvp2);
        when(rsvpService.allRsvps()).thenReturn(rsvpList);

        mockMvc.perform(get("/rsvp/all"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].rsvp_id").value("id1"))
               .andExpect(jsonPath("$[1].rsvp_id").value("id2"));
    }

    /* --- POST /rsvp/lookup --- */
    @Test public void testLookup() throws Exception {
        LookupDTO lookupDTO = new LookupDTO();
        lookupDTO.setFirst_name("John");
        lookupDTO.setLast_name("Doe");

        WeddingGuest guest = new WeddingGuest();
        // Assume that fullName is normalized using getFullName.
        String fullName = StringFormatUtil.formatToIndexName("John", "Doe");
        guest.setFullName(fullName);
        // Simulate associated RSVP IDs.
        guest.setRsvpIds(Arrays.asList("rsvp1", "rsvp2"));

        Rsvp rsvp1 = new Rsvp();
        rsvp1.setRsvpId("rsvp1");
        Rsvp rsvp2 = new Rsvp();
        rsvp2.setRsvpId("rsvp2");

        when(rsvpService.getGuest("John", "Doe")).thenReturn(guest);
        when(rsvpService.findRsvpById("rsvp1")).thenReturn(rsvp1);
        when(rsvpService.findRsvpById("rsvp2")).thenReturn(rsvp2);

        String jsonRequest = objectMapper.writeValueAsString(lookupDTO);
        mockMvc.perform(post("/rsvp/lookup").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].rsvp_id").value("rsvp1"))
               .andExpect(jsonPath("$[1].rsvp_id").value("rsvp2"));
    }

    /* --- POST /rsvp/guest/add --- */
    @Test public void testAddGuest() throws Exception {
        AddGuestDTO addGuestDTO = new AddGuestDTO();
        addGuestDTO.setFirst_name("Jane");
        addGuestDTO.setLast_name("Doe");
        addGuestDTO.setRsvp_id("rsvp-add");

        String jsonRequest = objectMapper.writeValueAsString(addGuestDTO);
        // Since the controller calls strip() on the concatenated names,
        // assume the stripped value is "Jane Doe" (or use StringFormatUtil.strip() to determine expected value).
        String expectedDisplayName = "Jane Doe";

        mockMvc.perform(post("/rsvp/guest/add").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP association added successfully."));
        verify(rsvpService).addGuest(expectedDisplayName, "rsvp-add");
    }

    /* --- POST /rsvp/guest/remove --- */
    @Test public void testRemoveGuest() throws Exception {
        AddGuestDTO removeGuestDTO = new AddGuestDTO();
        removeGuestDTO.setFirst_name("Jane");
        removeGuestDTO.setLast_name("Doe");
        removeGuestDTO.setRsvp_id("rsvp-remove");

        String jsonRequest = objectMapper.writeValueAsString(removeGuestDTO);
        String expectedFullName = "Jane Doe";

        mockMvc.perform(post("/rsvp/guest/remove").contentType(MediaType.APPLICATION_JSON).content(jsonRequest))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.message").value("RSVP association removed successfully."));
        verify(rsvpService).removeGuest(expectedFullName, "rsvp-remove");
    }

    /* --- GET /rsvp/guest/all --- */
    @Test public void testGetAllGuests() throws Exception {
        WeddingGuest guest1 = new WeddingGuest();
        guest1.setFullName(StringFormatUtil.formatToIndexName("John", "Doe"));
        WeddingGuest guest2 = new WeddingGuest();
        guest2.setFullName(StringFormatUtil.formatToIndexName("Jane", "Doe"));
        List<WeddingGuest> guests = Arrays.asList(guest1, guest2);
        when(rsvpService.allGuests()).thenReturn(guests);

        mockMvc.perform(get("/rsvp/guest/all"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].fullName").value(StringFormatUtil.formatToIndexName("John", "Doe")))
               .andExpect(jsonPath("$[1].fullName").value(StringFormatUtil.formatToIndexName("Jane", "Doe")));
    }
}
