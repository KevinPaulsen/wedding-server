package com.paulsen.wedding.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
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
import java.util.Objects;

@Service
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final AvailableRsvpCodeRepository availableRsvpCodeRepository;
    private final DynamoDBMapper dynamoDBMapper;

    public RsvpService(RsvpRepository rsvpRepository, AvailableRsvpCodeRepository availableRsvpCodeRepository, DynamoDBMapper dynamoDBMapper) {
        this.rsvpRepository = rsvpRepository;
        this.availableRsvpCodeRepository = availableRsvpCodeRepository;
        this.dynamoDBMapper = dynamoDBMapper;
    }

    public List<Rsvp> allRsvps() {
        List<Rsvp> users = new ArrayList<>();
        rsvpRepository.findAll().forEach(users::add);
        return users;
    }

    public Rsvp findRsvpByRsvpCode(String rsvpCode) {
        return rsvpRepository.findByRsvpCode(rsvpCode).orElseThrow();
    }

    @Transactional
    public Rsvp createRsvp(AddRsvpDto input) {
        if (!input.getRsvpCode().isEmpty() && rsvpRepository.findByRsvpCode(input.getRsvpCode()).isPresent()) {
            throw new IndexNotFoundException("RSVP already exists");
        }

        Rsvp rsvp = new Rsvp();

        if (input.getRsvpCode().isEmpty()) {
            rsvp.setRsvpCode(generateUniqueCode());
        } else {
            rsvp.setRsvpCode(input.getRsvpCode());
        }

        rsvp.setLastNames(input.getLastNames());
        rsvp.setPrimaryContact(input.getPrimaryContact());
        rsvp.setAllowedGuestCount(input.getAllowedGuestCount());
        rsvp.setGuestCount(input.getGuestCount());
        rsvp.setRsvpGuestDetails(input.getRsvpGuestDetails());

        return rsvpRepository.save(rsvp);
    }

    public Rsvp updateRsvp(PutRsvpDto input) {
        Rsvp rsvp = findRsvpByRsvpCode(input.getRsvpCode());

        if (!rsvp.getLastNames().contains(input.getLastName())) {
            throw new IndexNotFoundException(String.format("RSVP with code %s and last name %s not found",
                    input.getRsvpCode(), input.getLastName()));
        }

        rsvp.setPrimaryContact(input.getPrimaryContact());
        rsvp.setRsvpGuestDetails(input.getRsvpGuestDetails());

        return rsvpRepository.save(rsvp);
    }

    private synchronized String generateUniqueCode() {
        AvailableRsvpCode availableRsvpCode = availableRsvpCodeRepository.getAnyAvailableCode();

        while (availableRsvpCode != null) {
            if (rsvpRepository.findByRsvpCode(availableRsvpCode.getCode()).isEmpty()) {
                availableRsvpCodeRepository.delete(availableRsvpCode);
                break;
            }

            availableRsvpCode = availableRsvpCodeRepository.getAnyAvailableCode();
        }

        return availableRsvpCode == null ? "" : availableRsvpCode.getCode();
    }
}
