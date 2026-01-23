package com.edutech.medicalequipmentandtrackingsystem.service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import java.sql.SQLException;
import java.util.List;

public interface EquipmentService {
    Equipment addEquipment(Long hospitalId, Equipment equipment);
    List<Equipment> getAllEquipmentOfHospital(Long hospitalId) throws SQLException;
}
