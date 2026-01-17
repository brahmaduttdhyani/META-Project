package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;

import javax.persistence.EntityNotFoundException;
import java.sql.SQLException;
import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;
 
    @Autowired
    private HospitalRepository hospitalRepository;
 
 
    public Equipment addEquipment(Long hospitalId, Equipment equipment) {
 
        // check if hospital exists if yes then assigns equipment to that hospital else throws excption
        Hospital hospital=hospitalRepository.findById(hospitalId).orElseThrow(()->new EntityNotFoundException("Hospital with "+hospitalId+" does not exists."));
        equipment.setHospital(hospital);
        return equipmentRepository.save(equipment);
 
        
    }
 
    public List<Equipment> getAllEquipmentOfHospital(Long hospitalId) throws SQLException{
        // return all equipments of a particular hospital
        return equipmentRepository.findByHospitalId(hospitalId);
    
 
    }
    
}
