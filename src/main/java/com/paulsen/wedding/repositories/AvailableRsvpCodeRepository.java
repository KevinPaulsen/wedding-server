package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.AvailableRsvpCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvailableRsvpCodeRepository extends CrudRepository<AvailableRsvpCode, String> {
}
