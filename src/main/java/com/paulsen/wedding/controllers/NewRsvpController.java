package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.dto.RsvpDTO;
import com.paulsen.wedding.service.NewRsvpService;
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

    public NewRsvpController(NewRsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> register(@RequestBody RsvpDTO rsvpDTO) {
        try {
            Rsvp createdRsvp = rsvpService.createRsvp(rsvpDTO);
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
    public ResponseEntity<Map<String, String>> editRsvp(@RequestBody RsvpDTO rsvpDTO) {
        try {
            rsvpService.updateRsvp(rsvpDTO);
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

    @GetMapping("/all")
    public ResponseEntity<List<RsvpDTO>> getAllRsvps() {
        try {
            return ResponseEntity.ok(rsvpService.allRsvps().stream().map(RsvpDTO::new).toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
