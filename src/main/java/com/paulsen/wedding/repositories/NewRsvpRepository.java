package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.newRsvp.Rsvp;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan public interface NewRsvpRepository extends CrudRepository<Rsvp, String> {
    Optional<Rsvp> findByRsvpId(String rsvpId);
}

