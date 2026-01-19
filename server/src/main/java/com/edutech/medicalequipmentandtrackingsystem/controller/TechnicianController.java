package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;

import java.util.List;

@RestController
public class TechnicianController {
    // @Autowired
    // public MaintenanceService maintenanceService;
 
    // @GetMapping("/api/technician/maintenance")
    // public ResponseEntity<List<Maintenance>> getAllMaintenance() {
    //     List<Maintenance> maintenances = maintenanceService.getAllMaintenance();
    //     return new ResponseEntity<>(maintenances, HttpStatus.OK);
    // }
 
    // @PutMapping("/api/technician/maintenance/update/{maintenanceId}")
    // public ResponseEntity<Maintenance> updateMaintenance
    //         (@PathVariable Long maintenanceId, @RequestBody Maintenance updatedMaintenance) {
    //     Maintenance updatedRecord = maintenanceService.updateMaintenance(maintenanceId, updatedMaintenance);
    //     return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
    // }

     @Autowired
    private MaintenanceService maintenanceService;

    @PutMapping("/api/technician/maintenance/respond/{maintenanceId}")
    public ResponseEntity<?> respondToMaintenance(
            @PathVariable Long maintenanceId,
            @RequestParam String action, // ACCEPT or REJECT
            Authentication authentication
    ) {
        Maintenance updated = maintenanceService.respondToMaintenance(maintenanceId, action, authentication.getName());
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PutMapping("/api/technician/maintenance/update/{maintenanceId}")
    public ResponseEntity<?> updateMaintenance(
            @PathVariable Long maintenanceId,
            @RequestBody Maintenance maintenance,
            Authentication authentication
    ) {
        Maintenance updatedRecord = maintenanceService.updateMaintenanceSecured(maintenanceId, maintenance, authentication.getName());
        return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
    }

    // For technician to only see the their services and pending services
    @GetMapping("/api/technician/maintenance")
    public ResponseEntity<?> getAllMaintenance(Authentication authentication) {
        // return new ResponseEntity<>(maintenanceService.getAllMaintenance(), HttpStatus.OK);

        return new ResponseEntity<>(
            maintenanceService.getMaintenanceForTechnician(authentication.getName()),
            HttpStatus.OK
    );
    }
}
