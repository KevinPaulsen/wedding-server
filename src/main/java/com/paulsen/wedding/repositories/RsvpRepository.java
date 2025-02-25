package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.rsvp.Rsvp;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan public interface RsvpRepository extends CrudRepository<Rsvp, String> {
    Optional<Rsvp> findByRsvpId(String rsvpId);
}

