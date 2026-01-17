package com.edutech.medicalequipmentandtrackingsystem.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.medicalequipmentandtrackingsystem.dto.LoginRequest;
import com.edutech.medicalequipmentandtrackingsystem.dto.LoginResponse;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.jwt.JwtUtil;
import com.edutech.medicalequipmentandtrackingsystem.service.UserService;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;
 
    @Autowired
    private JwtUtil jwtUtil;
 
    @Autowired
    private AuthenticationManager authenticationManager;
 
    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        String duplicateMessage = userService.chechDuplicate(user);
        if(duplicateMessage != null){
            throw new ResponseStatusException(HttpStatus.CONFLICT,duplicateMessage);
        }
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }
 
    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
        }
 
        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails.getUsername());
 
        User user = userService.getUserByIdentifier(loginRequest.getUsername());
 
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getEmail(), user.getRole()));
    }
   
        // register user and return the registered user with status code 201 created
       // login user and return the login response with status code 200 ok
        // if authentication fails, return status code 401 unauthorized
    }

