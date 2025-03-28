package com.paulsen.wedding.controllers;

import static com.paulsen.wedding.util.StringFormatUtil.strip;

import com.paulsen.wedding.model.rsvp.CreateRsvpDTO;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import com.paulsen.wedding.model.weddingGuest.dto.AddGuestDTO;
import com.paulsen.wedding.model.weddingGuest.dto.LookupDTO;
import com.paulsen.wedding.service.RsvpService;
import java.util.Collection;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/rsvp")
@RestController
public class RsvpController {

  private final RsvpService rsvpService;

  public RsvpController(RsvpService rsvpService) {
    this.rsvpService = rsvpService;
  }

  private static void clearRestrictedFields(Rsvp rsvp) {
    rsvp.setSubmitted(true);

    if (rsvp.getRoce() != null) {
      rsvp.getRoce().setInvited(null);
    }
    if (rsvp.getRehearsal() != null) {
      rsvp.getRehearsal().setInvited(null);
    }
    if (rsvp.getCeremony() != null) {
      rsvp.getCeremony().setInvited(null);
    }
    if (rsvp.getReception() != null) {
      rsvp.getReception().setInvited(null);
    }
  }

  @PostMapping("/create")
  public ResponseEntity<Rsvp> create(@RequestBody CreateRsvpDTO rsvpDTO) {
    Rsvp savedRsvp = rsvpService.saveRsvp(rsvpDTO.toRsvp(), true);
    return new ResponseEntity<>(savedRsvp, HttpStatus.CREATED);
  }

  @PostMapping("/create-all")
  public ResponseEntity<Collection<Rsvp>> createAll(@RequestParam("file") MultipartFile file) {
    return new ResponseEntity<>(rsvpService.importRsvpsFromCsv(file), HttpStatus.CREATED);
  }

  @PutMapping("/edit")
  public ResponseEntity<Rsvp> editRsvp(@RequestBody Rsvp rsvpDTO) {
    return ResponseEntity.ok(rsvpService.saveRsvp(rsvpDTO, true));
  }

  @DeleteMapping("/delete")
  public ResponseEntity<Map<String, String>> delete(@RequestParam String rsvpId) {
    rsvpService.delete(rsvpId);
    return ResponseEntity.ok(Map.of("message", "RSVP object deleted successfully."));
  }

  @PostMapping("/submit")
  public ResponseEntity<Map<String, String>> submitRsvp(@RequestBody Rsvp rsvpDTO) {
    clearRestrictedFields(rsvpDTO);
    rsvpService.saveRsvp(rsvpDTO, false);
    return ResponseEntity.ok(Map.of("message", "RSVP object updated successfully."));
  }

  @GetMapping("/all")
  public ResponseEntity<List<Rsvp>> getAllRsvps() {
    return ResponseEntity.ok(rsvpService.allRsvps().stream().toList());
  }

  @PostMapping("/lookup")
  public ResponseEntity<List<Rsvp>> lookup(@RequestBody LookupDTO guestDto) {
    WeddingGuest guest = rsvpService.getGuest(guestDto.getFirst_name(), guestDto.getLast_name(),
        guestDto.getRsvp_code());
    return ResponseEntity.ok(guest.getRsvpIds().stream().map(rsvpService::findRsvpById).toList());
  }

  @PostMapping("/guest/add")
  public ResponseEntity<Map<String, String>> addGuest(@RequestBody AddGuestDTO addGuestDTO) {
    String displayName = strip(addGuestDTO.getFirst_name() + " " + addGuestDTO.getLast_name());
    rsvpService.addGuest(displayName, addGuestDTO.getRsvp_id());

    return ResponseEntity.ok(Map.of("message", "RSVP association added successfully."));
  }

  @PostMapping("/guest/remove")
  public ResponseEntity<Map<String, String>> removeGuest(@RequestBody AddGuestDTO guestDto) {
    String fullName = strip(guestDto.getFirst_name() + " " + guestDto.getLast_name());
    rsvpService.removeGuest(fullName, guestDto.getRsvp_id());

    return ResponseEntity.ok(Map.of("message", "RSVP association removed successfully."));
  }

  @GetMapping("/guest/all")
  public ResponseEntity<List<WeddingGuest>> getAllGuests() {
    return ResponseEntity.ok(rsvpService.allGuests());
  }
}
