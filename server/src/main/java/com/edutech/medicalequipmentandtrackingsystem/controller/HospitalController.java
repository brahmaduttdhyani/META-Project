package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.EquipmentService;
import com.edutech.medicalequipmentandtrackingsystem.service.HospitalService;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import net.bytebuddy.description.type.RecordComponentList;

import java.sql.SQLException;
import java.util.List;

@RestController
public class HospitalController {


    @Autowired
    private EquipmentService equipmentService;
 
    @Autowired
    private MaintenanceService maintenanceService;
 
    @Autowired
    private OrderService orderService;
 
    @Autowired
    private HospitalService hospitalService;
 
    @PostMapping("/api/hospital/create")
    public ResponseEntity<Hospital> createHospital(@RequestBody Hospital hospital) {
        Hospital createdHospital = hospitalService.createHospital(hospital);
        return new ResponseEntity<>(createdHospital, HttpStatus.CREATED);
    }
 
    @GetMapping("/api/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() throws SQLException {
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

    //assigns equipment to the hosp
    @PostMapping("/api/hospital/equipment")
    public ResponseEntity<Equipment> addEquipment(@RequestParam Long hospitalId, @RequestBody Equipment equipment) {
        Equipment addedEquipment = equipmentService.addEquipment(hospitalId, equipment);
        return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
    }
    
    //gets all equipments of particular hosp
    @GetMapping("/api/hospital/equipment/{hospitalId}")
    public ResponseEntity<List<Equipment>> getAllEquipmentsOfHospital(@PathVariable Long hospitalId) throws SQLException {
        List<Equipment> equipments = equipmentService.getAllEquipmentOfHospital(hospitalId);
        return new ResponseEntity<>(equipments, HttpStatus.OK);
    }
 
    @PostMapping("/api/hospital/maintenance/schedule")
    public ResponseEntity<Maintenance> scheduleMaintenance
            (@RequestParam Long equipmentId, @RequestBody Maintenance maintenance) throws SQLException {
        Maintenance scheduledMaintenance = maintenanceService.scheduleMaintenance(equipmentId, maintenance);
        return new ResponseEntity<>(scheduledMaintenance, HttpStatus.CREATED);
    }

    @GetMapping("/api/hospital/maintenances")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() throws SQLException{
        List<Maintenance> maintenances=maintenanceService.getAllMaintenance();
        return new ResponseEntity<>(maintenances,HttpStatus.OK);
    }
 
    @PostMapping("/api/hospital/order")
    public ResponseEntity<Order> placeOrder(@RequestParam Long equipmentId, @RequestBody Order order) throws SQLException {
        Order placedOrder = orderService.placeOrder(equipmentId, order);
        return new ResponseEntity<>(placedOrder, HttpStatus.CREATED);
    }
    
    @GetMapping("/api/hospital/orders")
    public ResponseEntity<List<Order>> getAllOrders() throws SQLException{
        List<Order> orders=orderService.getAllOrders();
        return new ResponseEntity<>(orders,HttpStatus.OK);
    }
    }
