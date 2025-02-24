package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.model.weddingGuest.dto.AddGuestDTO;
import com.paulsen.wedding.model.weddingGuest.dto.LookupDTO;
import com.paulsen.wedding.service.NewRsvpService;
import com.paulsen.wedding.service.WeddingGuestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/new/rsvp")
@RestController
public class NewRsvpController {

    private final NewRsvpService rsvpService;
    private final WeddingGuestService guestService;

    public NewRsvpController(NewRsvpService rsvpService, WeddingGuestService guestService) {
        this.rsvpService = rsvpService;
        this.guestService = guestService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> register(@RequestBody Rsvp rsvpDTO) {
        try {
            Rsvp createdRsvp = rsvpService.saveRsvp(rsvpDTO);
            return new ResponseEntity<>(Map.of("message", "RSVP object created successfully.",
                                               "rsvp_id", createdRsvp.getRsvpId()), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "An error occurred while creating the RSVP object."));
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<Map<String, String>> editRsvp(@RequestBody Rsvp rsvpDTO) {
        try {
            rsvpService.saveRsvp(rsvpDTO);
            return ResponseEntity.ok(Map.of("message", "RSVP object updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "An error occurred while updating the RSVP object."));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> delete(@RequestParam String rsvpId) {
        try {
            rsvpService.delete(rsvpId);
            return ResponseEntity.ok(Map.of("message", "RSVP object deleted successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "An error occurred while deleting the RSVP object."));
        }
    }

    @PostMapping("/lookup") public ResponseEntity<List<Rsvp>> lookup(@RequestBody LookupDTO guestDto) {
        WeddingGuest guest = guestService.getGuest(guestDto.getFirst_name(), guestDto.getLast_name());
        return ResponseEntity.ok(guest.getRsvpIds().stream().map(rsvpService::findRsvpById).toList());
    }

    @PostMapping("/guest/add")
    public ResponseEntity<Map<String, String>> addGuest(@RequestBody AddGuestDTO addGuestDTO) {
        guestService.addGuest(addGuestDTO.getFirst_name(), addGuestDTO.getLast_name(), addGuestDTO.getRsvp_id());

        return ResponseEntity.ok(Map.of("message", "RSVP association added successfully."));
    }

    @PostMapping("/guest/remove")
    public ResponseEntity<Map<String, String>> removeGuest(@RequestBody AddGuestDTO guestDto) {
        guestService.removeGuest(guestDto.getFirst_name(), guestDto.getLast_name(), guestDto.getRsvp_id());

        return ResponseEntity.ok(Map.of("message", "RSVP association removed successfully."));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rsvp>> getAllRsvps() {
        try {
            return ResponseEntity.ok(rsvpService.allRsvps().stream().toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
