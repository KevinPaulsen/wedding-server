package com.paulsen.wedding.service;

import com.amazonaws.services.dynamodbv2.model.IndexNotFoundException;
import com.paulsen.wedding.model.AvailableRsvpCode;
import com.paulsen.wedding.model.rsvp.AddRsvpDto;
import com.paulsen.wedding.model.rsvp.PutRsvpDto;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.repositories.AvailableRsvpCodeRepository;
import com.paulsen.wedding.repositories.RsvpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final AvailableRsvpCodeRepository availableRsvpCodeRepository;

    public RsvpService(RsvpRepository rsvpRepository, AvailableRsvpCodeRepository availableRsvpCodeRepository) {
        this.rsvpRepository = rsvpRepository;
        this.availableRsvpCodeRepository = availableRsvpCodeRepository;
    }

    public List<Rsvp> allRsvps() {
        List<Rsvp> users = new ArrayList<>();
        rsvpRepository.findAll().forEach(users::add);
        return users;
    }

    public Rsvp findMatchingRsvp(String rsvpCode, String lastname) {
        Rsvp rsvp = rsvpRepository.findByRsvpCode(formatRsvpCode(rsvpCode)).orElse(null);

        if (rsvp == null || !rsvp.hasLastname(lastname)) {
            throw new IndexNotFoundException(String.format("No RSVP found with code %s and lastname %s",
                                                           rsvpCode,
                                                           lastname));
        }

        return rsvp;
    }

    public Rsvp findRsvpByRsvpCode(String rsvpCode) {
        return rsvpRepository.findByRsvpCode(formatRsvpCode(rsvpCode)).orElseThrow();
    }

    @Transactional public Rsvp createRsvp(AddRsvpDto input) {
        Rsvp rsvp = new Rsvp();

        rsvp.setRsvpCode(generateUniqueCode(input.getRsvpCode()));
        rsvp.setRsvpStatus(input.getRsvpStatus());
        rsvp.setLastnames(input.getLastnames());
        rsvp.setPrimaryContact(input.getPrimaryContact());
        rsvp.setAllowedGuestCount(input.getAllowedGuestCount());
        rsvp.setRsvpGuestDetails(input.getRsvpGuestDetails());

        if (rsvpRepository.existsById(rsvp.getRsvpCode())) {
            throw new IndexNotFoundException("RSVP already exists");
        }

        return rsvpRepository.save(rsvp);
    }

    public Rsvp updateRsvp(PutRsvpDto input) {
        if (input.getRsvpCode() == null || input.getRsvpCode().isEmpty()) {
            throw new IllegalArgumentException("RSVP code is required");
        }

        if (input.getLastName() == null || input.getLastName().isEmpty()) {
            throw new IllegalArgumentException("Lastname is required");
        }

        Rsvp rsvp = findRsvpByRsvpCode(input.getRsvpCode());

        if (!rsvp.hasLastname(input.getLastName())) {
            throw new IndexNotFoundException(String.format("RSVP with code %s and last name %s not found",
                                                           input.getRsvpCode(),
                                                           input.getLastName()));
        }

        rsvp.setRsvpStatus(input.getRsvpStatus());
        rsvp.setPrimaryContact(input.getPrimaryContact());
        rsvp.setRsvpGuestDetails(input.getRsvpGuestDetails());

        return rsvpRepository.save(rsvp);
    }

    private synchronized String generateUniqueCode(String rsvpCode) {
        if (rsvpCode != null && !rsvpCode.isEmpty()) {
            return formatRsvpCode(rsvpCode);
        }

        AvailableRsvpCode availableRsvpCode;
        String formattedCode;

        do {
            availableRsvpCode = availableRsvpCodeRepository.getAnyAvailableCode();
            availableRsvpCodeRepository.delete(availableRsvpCode);

            formattedCode = formatRsvpCode(availableRsvpCode.getCode());

            if (rsvpRepository.findByRsvpCode(formattedCode).isEmpty()) {
                availableRsvpCode = null;
            }
        } while (availableRsvpCode != null);

        return formattedCode;
    }

    private static String formatRsvpCode(String rsvpCode) {
        return rsvpCode == null ? "" : rsvpCode.toUpperCase().strip();
    }

    @Transactional public void delete(String rsvpCode) {
        rsvpRepository.deleteById(rsvpCode);
    }
}
