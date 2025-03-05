package com.paulsen.wedding.service;

import com.paulsen.wedding.model.User;
import com.paulsen.wedding.repositories.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> allUsers() {
    List<User> users = new ArrayList<>();
    userRepository.findAll().forEach(users::add);
    return users;
  }

  public User findByUsername(String username) {
    return userRepository.findByUsername(username).orElseThrow();
  }
}