package com.edutech.medicalequipmentandtrackingsystem.service.serviceImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.HospitalService;

import java.sql.SQLException;
import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public List<Hospital> getAllHospitals() throws SQLException {
        return hospitalRepository.findAll();
    }

    @Override
    public List<Hospital> getHospitalsByCreator(String username) {
        return hospitalRepository.findByCreatedBy(username);
    }

    @Override
    public Hospital createHospital(Hospital hospital, String username) {
        hospital.setCreatedBy(username);
        return hospitalRepository.save(hospital);
    }
}
