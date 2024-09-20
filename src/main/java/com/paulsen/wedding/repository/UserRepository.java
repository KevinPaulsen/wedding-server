package com.paulsen.wedding.repository;

import com.paulsen.wedding.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}

