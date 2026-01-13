package com.edutech.medicalequipmentandtrackingsystem.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;
    public Hospital createHospital(Hospital hospital) {
        // create hospital
        return hospitalRepository.save(hospital);
    }
 
    public List<Hospital> getAllHospitals() throws SQLException{
        // return list of hospitals
        return hospitalRepository.findAll();
    }
}
