package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital,Long> {
    // extends JpaRepositor and add custom methods if needed
}

