package com.edutech.medicalequipmentandtrackingsystem.service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import java.sql.SQLException;
import java.util.List;

public interface HospitalService {
    List<Hospital> getAllHospitals() throws SQLException;
    List<Hospital> getHospitalsByCreator(String username);
    Hospital createHospital(Hospital hospital, String username);
}
