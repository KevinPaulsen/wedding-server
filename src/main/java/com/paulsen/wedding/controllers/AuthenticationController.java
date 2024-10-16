package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.User;
import com.paulsen.wedding.responses.LoginResponse;
import com.paulsen.wedding.security.LoginUserDto;
import com.paulsen.wedding.security.RegisterUserDto;
import com.paulsen.wedding.service.AuthenticationService;
import com.paulsen.wedding.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth") @RestController public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup") public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login") public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<Boolean> verifyToken(@RequestHeader("Authorization") String authorizationHeader) {
        boolean isValid = authorizationHeader.length() > 7 && jwtService.isTokenValid(authorizationHeader.substring(7));
        return ResponseEntity.ok(isValid);
    }
}
