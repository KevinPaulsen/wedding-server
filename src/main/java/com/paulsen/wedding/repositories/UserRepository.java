package com.paulsen.wedding.repositories;

import com.paulsen.wedding.model.User;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
}

