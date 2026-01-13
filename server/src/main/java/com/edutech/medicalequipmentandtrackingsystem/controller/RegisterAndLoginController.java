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


public class RegisterAndLoginController {


   
        // register user and return the registered user with status code 201 created
       // login user and return the login response with status code 200 ok
        // if authentication fails, return status code 401 unauthorized
    }

