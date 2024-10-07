package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.AddRsvpDto;
import com.paulsen.wedding.model.Rsvp;
import com.paulsen.wedding.service.RsvpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/rsvp")
@RestController
public class RsvpController {
    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping("/addRsvp")
    public ResponseEntity<Rsvp> register(@RequestBody AddRsvpDto addRsvpDto) {
        Rsvp addedRsvp = rsvpService.initializeRsvp(addRsvpDto);

        return ResponseEntity.ok(addedRsvp);
    }

    @GetMapping("/getRsvp")
    public ResponseEntity<Rsvp> authenticatedUser(@RequestBody String rsvpCode) {
        Rsvp rsvp = rsvpService.findRsvpByRsvpCode(rsvpCode);

        return ResponseEntity.ok(rsvp);
    }
}
