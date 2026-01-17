package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;

import java.util.List;

@RestController
public class TechnicianController {
    @Autowired
    public MaintenanceService maintenanceService;
 
    @GetMapping("/api/technician/maintenance")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        List<Maintenance> maintenances = maintenanceService.getAllMaintenance();
        return new ResponseEntity<>(maintenances, HttpStatus.OK);
    }
 
    @PutMapping("/api/technician/maintenance/update/{maintenanceId}")
    public ResponseEntity<Maintenance> updateMaintenance
            (@PathVariable Long maintenanceId, @RequestBody Maintenance updatedMaintenance) {
        Maintenance updatedRecord = maintenanceService.updateMaintenance(maintenanceId, updatedMaintenance);
        return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
    }
}
