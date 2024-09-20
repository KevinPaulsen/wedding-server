package com.paulsen.wedding.config;

import com.paulsen.wedding.model.Role;
import com.paulsen.wedding.model.User;
import com.paulsen.wedding.repository.RoleRepository;
import com.paulsen.wedding.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer {

    @Bean
    public ApplicationRunner initializer(
            RoleRepository roleRepository,
            UserRepository userRepository) {
        return args -> {
            // Create roles if they don't exist
            if (!roleRepository.existsById("ROLE_USER")) {
                roleRepository.save(new Role("ROLE_USER"));
            }
            if (!roleRepository.existsById("ROLE_ADMIN")) {
                roleRepository.save(new Role("ROLE_ADMIN"));
            }

            // Create admin user if not exists
            if (!userRepository.existsById("admin")) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword("AdminPassword");
                adminUser.setEnabled(true);

                Role adminRole = roleRepository.findById("ROLE_ADMIN").get();

                adminUser.setRoles(Set.of(adminRole));

                userRepository.save(adminUser);
            }

            // Create regular user if not exists
            if (!userRepository.existsById("user")) {
                User regularUser = new User();
                regularUser.setUsername("user");
                regularUser.setPassword("UserPassword");
                regularUser.setEnabled(true);

                Role userRole = roleRepository.findById("ROLE_USER").get();

                regularUser.setRoles(Set.of(userRole));

                userRepository.save(regularUser);
            }
        };
    }
}

