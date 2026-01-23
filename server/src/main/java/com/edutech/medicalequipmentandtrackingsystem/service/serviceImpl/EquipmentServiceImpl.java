package com.edutech.medicalequipmentandtrackingsystem.service.serviceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.EquipmentService;

import javax.persistence.EntityNotFoundException;
import java.sql.SQLException;
import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Override
    public Equipment addEquipment(Long hospitalId, Equipment equipment) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new EntityNotFoundException("Hospital with " + hospitalId + " does not exist."));
        equipment.setHospital(hospital);
        return equipmentRepository.save(equipment);
    }

    @Override
    public List<Equipment> getAllEquipmentOfHospital(Long hospitalId) throws SQLException {
        return equipmentRepository.findByHospitalId(hospitalId);
    }
}
