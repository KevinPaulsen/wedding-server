package com.paulsen.wedding;

import com.paulsen.wedding.model.User;
import com.paulsen.wedding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api")
public class WeddingController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{name}")
    public EntityModel<User> getUser(@PathVariable String name) {
        User user = userRepository.findById(name).orElseThrow(IllegalAccessError::new);
        return EntityModel.of(user,
                linkTo(methodOn(WeddingController.class).getUser(name)).withSelfRel(),
                linkTo(methodOn(WeddingController.class).getUsers()).withRel("users"));
    }

    @GetMapping("/users")
    public CollectionModel<EntityModel<User>> getUsers() {
        List<EntityModel<User>> users = userRepository.findAll().stream().map(user -> EntityModel.of(
                user,
                linkTo(methodOn(WeddingController.class).getUser(user.getUsername())).withSelfRel(),
                linkTo(methodOn(WeddingController.class).getUsers()).withRel("users"))).toList();

        return CollectionModel.of(users, linkTo(methodOn(WeddingController.class).getUsers()).withSelfRel());
    }
}
