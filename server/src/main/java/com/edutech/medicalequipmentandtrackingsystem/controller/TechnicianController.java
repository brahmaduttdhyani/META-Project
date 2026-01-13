package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;

import java.util.List;


public class TechnicianController {

    @GetMapping("/api/technician/maintenance")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return null;
        // Get all maintenance records and return them with status code 200 OK;
    }

    @PutMapping("/api/technician/maintenance/update/{maintenanceId}")
    public ResponseEntity<Maintenance> updateMaintenance
            (@PathVariable Long maintenanceId, @RequestBody Maintenance updatedMaintenance) {
                return null;
        // Update the maintenance record with the given id and return updated record with status code 200 OK;
    }
}
