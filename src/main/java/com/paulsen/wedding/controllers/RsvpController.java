package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.rsvp.AddRsvpDto;
import com.paulsen.wedding.model.rsvp.PutRsvpDto;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.service.RsvpService;
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

@RequestMapping("/rsvp") @RestController public class RsvpController {
    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping("/create") public ResponseEntity<Rsvp> register(@RequestBody AddRsvpDto addRsvpDto) {
        Rsvp addedRsvp = rsvpService.createRsvp(addRsvpDto);

        return ResponseEntity.ok(addedRsvp);
    }

    @PutMapping("/update") public ResponseEntity<Rsvp> update(@RequestBody PutRsvpDto putRsvpDto) {
        Rsvp rsvp = rsvpService.updateRsvp(putRsvpDto);

        return ResponseEntity.ok(rsvp);
    }

    @GetMapping("/get")
    public ResponseEntity<Rsvp> authenticatedUser(@RequestParam String rsvpCode, @RequestParam String lastname) {
        Rsvp rsvp = rsvpService.findMatchingRsvp(rsvpCode, lastname);

        return ResponseEntity.ok(rsvp);
    }

    @GetMapping("/all") public ResponseEntity<List<Rsvp>> getAllRsvps() {
        return ResponseEntity.ok(rsvpService.allRsvps());
    }

    @DeleteMapping("/delete") public ResponseEntity<Void> delete(@RequestBody String rsvpCode) {
        rsvpService.delete(rsvpCode);

        return ResponseEntity.noContent().build();
    }
}
