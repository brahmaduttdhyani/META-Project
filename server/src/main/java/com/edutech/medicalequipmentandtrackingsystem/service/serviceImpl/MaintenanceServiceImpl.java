package com.edutech.medicalequipmentandtrackingsystem.service.serviceImpl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.MaintenanceRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Maintenance> getAllMaintenance(String username) {
        return maintenanceRepository.findByEquipment_Hospital_CreatedBy(username);
    }

    @Override
    public Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
            .orElseThrow(() -> new RuntimeException("Equipment not found"));

        maintenance.setEquipment(equipment);
        maintenance.setRequestStatus("PENDING");
        maintenance.setAssignedTechnicianId(null);

        return maintenanceRepository.save(maintenance);
    }

    @Override
    public Maintenance updateMaintenance(Long maintenanceId, Maintenance updatedMaintenance) {
        Maintenance existingMaintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance record not found with ID: " + maintenanceId));

        updatedMaintenance.setId(existingMaintenance.getId());
        updatedMaintenance.setEquipment(existingMaintenance.getEquipment());

        return maintenanceRepository.save(updatedMaintenance);
    }

    @Override
    public Maintenance cancelMaintenance(Long maintenanceId) {
        Maintenance m = maintenanceRepository.findById(maintenanceId)
            .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        if ("In Progress".equalsIgnoreCase(m.getStatus())) {
            throw new RuntimeException("Cannot cancel maintenance once it is In Progress");
        }

        m.setStatus("Cancelled");
        return maintenanceRepository.save(m);
    }

    @Override
    public Maintenance respondToMaintenance(Long maintenanceId, String action, String username) {
        User tech = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"TECHNICIAN".equalsIgnoreCase(tech.getRole())) {
            throw new RuntimeException("Only technician can respond");
        }

        Maintenance m = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        if ("ACCEPT".equalsIgnoreCase(action)) {
            if ("ACCEPTED".equalsIgnoreCase(m.getRequestStatus())
                    && m.getAssignedTechnicianId() != null
                    && !m.getAssignedTechnicianId().equals(tech.getId())) {
                throw new RuntimeException("Already accepted by another technician");
            }

            m.setRequestStatus("ACCEPTED");
            m.setAssignedTechnicianId(tech.getId());
            m.setAssignedTechnicianName(tech.getUsername());
            return maintenanceRepository.save(m);
        }

        if ("REJECT".equalsIgnoreCase(action)) {
            return m;
        }

        throw new RuntimeException("Invalid action. Use ACCEPT or REJECT");
    }

    @Override
    public Maintenance updateMaintenanceSecured(Long maintenanceId, Maintenance updatedMaintenance, String username) {
        User tech = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Maintenance existing = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        if (!"ACCEPTED".equalsIgnoreCase(existing.getRequestStatus())) {
            throw new RuntimeException("Maintenance not accepted yet");
        }

        if (existing.getAssignedTechnicianId() == null || !existing.getAssignedTechnicianId().equals(tech.getId())) {
            throw new RuntimeException("You are not assigned to this maintenance");
        }

        existing.setCompletedDate(updatedMaintenance.getCompletedDate());
        existing.setDescription(updatedMaintenance.getDescription());
        existing.setStatus(updatedMaintenance.getStatus());

        return maintenanceRepository.save(existing);
    }

    @Override
    public List<Maintenance> getMaintenanceForTechnician(String username) {
        User tech = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Maintenance> pending = maintenanceRepository.findByRequestStatusIgnoreCase("PENDING");
        pending.removeIf(m -> m.getStatus() != null && m.getStatus().equalsIgnoreCase("Cancelled"));

        List<Maintenance> mine = maintenanceRepository.findByAssignedTechnicianId(tech.getId());
        mine.removeIf(m -> m.getStatus() != null && m.getStatus().equalsIgnoreCase("Cancelled"));

        pending.addAll(mine);

        pending.forEach(m -> {
            try {
                String createdBy = m.getEquipment().getHospital().getCreatedBy();
                m.setRequestedBy(createdBy);
            } catch (Exception e) {
                m.setRequestedBy(null);
            }
        });
        return pending;
    }
}
