package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;
import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;
 
    @Autowired
    private PasswordEncoder passwordEncoder;
 
    public User registerUser(User user) {
        boolean usernameTaken=userRepository.existsByUsername(user.getUsername());
        boolean emailTaken=userRepository.existsByEmail(user.getEmail());
        if(usernameTaken || emailTaken){
            return null;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String chechDuplicate(User user){
        if(userRepository.existsByUsername(user.getUsername())){
            return "Username already exists";
        }
        if(userRepository.existsByEmail(user.getEmail())){
            return "Email already exists";
        }
        return null;
    }
 
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow();
    }

    public User getUserByIdentifier(String identifier){
        User byUsername=userRepository.findByUsername(identifier).orElseThrow();
        if(byUsername != null) return byUsername;
        return userRepository.findByEmail(identifier);
    }
 
    @Override
    public UserDetails loadUserByUsername(String identifier) {
        User user = getUserByIdentifier(identifier);
        if (user == null) {
            throw new UsernameNotFoundException(identifier + "is not found");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>());
    }
}
