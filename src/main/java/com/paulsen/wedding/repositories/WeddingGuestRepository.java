package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.weddingGuest.WeddingGuest;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan public interface WeddingGuestRepository extends CrudRepository<WeddingGuest, String> {
    Optional<WeddingGuest> findByFullName(String fullName);
}

