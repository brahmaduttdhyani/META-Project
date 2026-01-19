package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance,Long> {
    // extend  jpa repository and add custom methods if needed
    List<Hospital> findByEquipmentId(Long equipmentId); 

    // For only the technician to see
    List<Maintenance> findByRequestStatusIgnoreCase(String requestStatus);
    List<Maintenance> findByAssignedTechnicianId(Long technicianId);
}
