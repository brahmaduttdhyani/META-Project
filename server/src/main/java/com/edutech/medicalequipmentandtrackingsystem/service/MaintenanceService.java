package com.edutech.medicalequipmentandtrackingsystem.service;

import java.util.List;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;

public interface MaintenanceService {

    List<Maintenance> getAllMaintenance(String username); 
    Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance); 
    Maintenance updateMaintenance(Long maintenanceId, Maintenance updatedMaintenance); 
    Maintenance cancelMaintenance(Long maintenanceId); 
    Maintenance respondToMaintenance(Long maintenanceId, String action, String username);
     Maintenance updateMaintenanceSecured(Long maintenanceId, Maintenance updatedMaintenance, String username); 
    List<Maintenance> getMaintenanceForTechnician(String username);
} 
    



