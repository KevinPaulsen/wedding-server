package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.newRsvp.CreateRsvpDTO;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.model.weddingGuest.dto.AddGuestDTO;
import com.paulsen.wedding.model.weddingGuest.dto.LookupDTO;
import com.paulsen.wedding.service.RsvpService;
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

import static com.paulsen.wedding.util.StringFormatUtil.getFullName;

@RequestMapping("/rsvp")
@RestController
public class RsvpController {

    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> create(@RequestBody CreateRsvpDTO rsvpDTO) {
        Rsvp savedRsvp = rsvpService.saveRsvp(rsvpDTO.toRsvp());
        return new ResponseEntity<>(Map.of("message", "RSVP object created successfully.",
                                           "rsvp_id", savedRsvp.getRsvpId()), HttpStatus.CREATED);
    }

    @PutMapping("/edit")
    public ResponseEntity<Map<String, String>> editRsvp(@RequestBody Rsvp rsvpDTO) {
        rsvpService.saveRsvp(rsvpDTO);
        return ResponseEntity.ok(Map.of("message", "RSVP object updated successfully."));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> delete(@RequestParam String rsvpId) {
        rsvpService.delete(rsvpId);
        return ResponseEntity.ok(Map.of("message", "RSVP object deleted successfully."));
    }

    @PostMapping("/submit") public ResponseEntity<Map<String, String>> submitRsvp(@RequestBody Rsvp rsvpDTO) {
        clearRestrictedFields(rsvpDTO);
        rsvpService.saveRsvp(rsvpDTO);
        return ResponseEntity.ok(Map.of("message", "RSVP object updated successfully."));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rsvp>> getAllRsvps() {
        return ResponseEntity.ok(rsvpService.allRsvps().stream().toList());
    }

    @PostMapping("/lookup") public ResponseEntity<List<Rsvp>> lookup(@RequestBody LookupDTO guestDto) {
        WeddingGuest guest = rsvpService.getGuest(guestDto.getFirst_name(), guestDto.getLast_name());
        return ResponseEntity.ok(guest.getRsvpIds().stream().map(rsvpService::findRsvpById).toList());
    }

    @PostMapping("/guest/add")
    public ResponseEntity<Map<String, String>> addGuest(@RequestBody AddGuestDTO addGuestDTO) {
        String fullName = getFullName(addGuestDTO.getFirst_name(), addGuestDTO.getLast_name());
        String displayName = addGuestDTO.getFirst_name() + " " + addGuestDTO.getLast_name();
        rsvpService.addGuest(fullName, displayName, addGuestDTO.getRsvp_id());

        return ResponseEntity.ok(Map.of("message", "RSVP association added successfully."));
    }

    @PostMapping("/guest/remove")
    public ResponseEntity<Map<String, String>> removeGuest(@RequestBody AddGuestDTO guestDto) {
        String fullName = getFullName(guestDto.getFirst_name(), guestDto.getLast_name());
        rsvpService.removeGuest(fullName, guestDto.getRsvp_id());

        return ResponseEntity.ok(Map.of("message", "RSVP association removed successfully."));
    }

    @GetMapping("/guest/all")
    public ResponseEntity<List<WeddingGuest>> getAllGuests() {
        return ResponseEntity.ok(rsvpService.allGuests());
    }

    private static void clearRestrictedFields(Rsvp rsvp) {
        rsvp.setSubmitted(true);
        rsvp.setGuestList(null);

        if (rsvp.getRoce() != null) {
            rsvp.getRoce().setAllowedGuests(-1);
        }
        if (rsvp.getRehearsal() != null) {
            rsvp.getRehearsal().setAllowedGuests(-1);
        }
        if (rsvp.getCeremony() != null) {
            rsvp.getCeremony().setAllowedGuests(-1);
        }
        if (rsvp.getReception() != null) {
            rsvp.getReception().setAllowedGuests(-1);
        }
    }
}
