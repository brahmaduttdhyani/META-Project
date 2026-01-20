package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.MaintenanceRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class MaintenanceService {
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
 
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;
 
 
    public List<Maintenance> getAllMaintenance(String username) {
        return maintenanceRepository.findByEquipment_Hospital_CreatedBy(username);
    }

    //OLD
    //scheduling the maintenance using the Id of the Equipment
    // public Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance) {
    //     Equipment equipment = equipmentRepository.findById(equipmentId)
    //             .orElseThrow(() -> new EntityNotFoundException("Equipment not found with ID: " + equipmentId));
 
    //     // Set the equipment for the maintenance task
    //     maintenance.setEquipment(equipment);
 
    //     return maintenanceRepository.save(maintenance);
    // }


    public Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance) {
    Equipment equipment = equipmentRepository.findById(equipmentId)
        .orElseThrow(() -> new RuntimeException("Equipment not found"));

    maintenance.setEquipment(equipment);

    // NEW defaults (no change to your current flow, just adds initial state)
    maintenance.setRequestStatus("PENDING");
    maintenance.setAssignedTechnicianId(null);

    // keep whatever status you already send (Initiated)
    // maintenance.setStatus(maintenance.getStatus());

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



    // NEW
    
    public Maintenance cancelMaintenance(Long maintenanceId) {
    Maintenance m = maintenanceRepository.findById(maintenanceId)
        .orElseThrow(() -> new RuntimeException("Maintenance not found"));
 
    if ("In Progress".equalsIgnoreCase(m.getStatus())) {
        throw new RuntimeException("Cannot cancel maintenance once it is In Progress");
    }
 
    m.setStatus("Cancelled");
    return maintenanceRepository.save(m);
}


    public Maintenance respondToMaintenance(Long maintenanceId, String action, String username) {

    User tech = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"TECHNICIAN".equalsIgnoreCase(tech.getRole())) {
        throw new RuntimeException("Only technician can respond");
    }

    Maintenance m = maintenanceRepository.findById(maintenanceId)
            .orElseThrow(() -> new RuntimeException("Maintenance not found"));

    if ("ACCEPT".equalsIgnoreCase(action)) {

        // block if already accepted by another technician
        if ("ACCEPTED".equalsIgnoreCase(m.getRequestStatus())
                && m.getAssignedTechnicianId() != null
                && !m.getAssignedTechnicianId().equals(tech.getId())) {
            throw new RuntimeException("Already accepted by another technician");
        }

        m.setRequestStatus("ACCEPTED");
        m.setAssignedTechnicianId(tech.getId());
        
        // For assigned technician name
        m.setAssignedTechnicianName(tech.getUsername());

        return maintenanceRepository.save(m);
    }

    // ✅ REJECT: do nothing in DB (handled locally in UI)
    if ("REJECT".equalsIgnoreCase(action)) {
        return m;
    }

    throw new RuntimeException("Invalid action. Use ACCEPT or REJECT");
}



    public Maintenance updateMaintenanceSecured(Long maintenanceId, Maintenance updatedMaintenance, String username) {

        User tech = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Maintenance existing = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        // LOCK: only accepted technician can update
        if (!"ACCEPTED".equalsIgnoreCase(existing.getRequestStatus())) {
            throw new RuntimeException("Maintenance not accepted yet");
        }

        if (existing.getAssignedTechnicianId() == null || !existing.getAssignedTechnicianId().equals(tech.getId())) {
            throw new RuntimeException("You are not assigned to this maintenance");
        }

        // update only allowed fields (keep equipment/scheduledDate safe)
        existing.setCompletedDate(updatedMaintenance.getCompletedDate());
        existing.setDescription(updatedMaintenance.getDescription());
        existing.setStatus(updatedMaintenance.getStatus());

        return maintenanceRepository.save(existing);
    }


    // For technician to see only their services

    public List<Maintenance> getMaintenanceForTechnician(String username) {
    User tech = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Maintenance> pending = maintenanceRepository.findByRequestStatusIgnoreCase("PENDING");
    List<Maintenance> mine = maintenanceRepository.findByAssignedTechnicianId(tech.getId());

    pending.addAll(mine);
    return pending;
}

}
