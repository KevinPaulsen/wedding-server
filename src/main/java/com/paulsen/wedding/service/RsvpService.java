package com.paulsen.wedding.service;

import com.amazonaws.services.dynamodbv2.model.IndexNotFoundException;
import com.paulsen.wedding.model.AddRsvpDto;
import com.paulsen.wedding.model.PutRsvpDto;
import com.paulsen.wedding.model.Rsvp;
import com.paulsen.wedding.repositories.RsvpRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RsvpService {
    private final RsvpRepository rsvpRepository;

    public RsvpService(RsvpRepository rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    public List<Rsvp> allRsvps() {
        List<Rsvp> users = new ArrayList<>();
        rsvpRepository.findAll().forEach(users::add);
        return users;
    }

    public Rsvp findRsvpByRsvpCode(String rsvpCode) {
        return rsvpRepository.findByRsvpCode(rsvpCode).orElseThrow();
    }

    public Rsvp initializeRsvp(AddRsvpDto input) {
        Rsvp rsvp = new Rsvp();
        rsvp.setRsvpCode(input.getRsvpCode());
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
}
