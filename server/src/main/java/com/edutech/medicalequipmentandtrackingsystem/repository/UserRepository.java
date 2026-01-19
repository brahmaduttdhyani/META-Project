package com.edutech.medicalequipmentandtrackingsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
    // User findByRole (String role);

    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}

