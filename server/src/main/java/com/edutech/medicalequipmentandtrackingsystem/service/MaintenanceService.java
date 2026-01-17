package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.MaintenanceRepository;
import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class MaintenanceService {
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
 
    @Autowired
    private EquipmentRepository equipmentRepository;
 
 
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }
    //scheduling the maintenance using the Id of the Equipment
    public Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found with ID: " + equipmentId));
 
        // Set the equipment for the maintenance task
        maintenance.setEquipment(equipment);
 
        return maintenanceRepository.save(maintenance);
    }
 
   //Updating the maintenance using the id 
    public Maintenance updateMaintenance(Long maintenanceId, Maintenance updatedMaintenance) {
        // Check if the maintenance record with the given ID exists
        Maintenance existingMaintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance record not found with ID: " + maintenanceId));
 
        updatedMaintenance.setId(existingMaintenance.getId());
        updatedMaintenance.setEquipment(existingMaintenance.getEquipment());
 
        // Save the updated maintenance record
        return maintenanceRepository.save(updatedMaintenance);
    }
}
