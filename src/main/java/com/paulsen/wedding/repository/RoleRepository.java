package com.paulsen.wedding.repository;

import com.paulsen.wedding.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
