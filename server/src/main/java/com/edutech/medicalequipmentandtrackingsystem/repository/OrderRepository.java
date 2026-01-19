package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    // extend j pa repository and add method if needed
    List<Order> findByEquipmentId(Long equipmentId);

    List<Order> findByRequestStatusIgnoreCase(String requestStatus);

    List<Order> findByAssignedSupplierId(Long assignedSupplierId);
}
