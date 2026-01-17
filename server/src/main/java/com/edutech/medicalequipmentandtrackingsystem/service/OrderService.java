package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    
@Autowired
    private OrderRepository orderRepository;
 
    @Autowired
    private EquipmentRepository equipmentRepository;
 
    public Order placeOrder(Long equipmentId, Order order) {
        // Check if the  equipment with the given ID exists
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found with ID: " + equipmentId));
 
        order.setEquipment(equipment);
        order.setStatus("Initiated");
 
        // Save the order
        return orderRepository.save(order);
    }
 
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
 
    public Order updateOrderStatus(Long orderId, String newStatus) {
        // Check if the order with the given ID exists
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
 
        // Update the order status
        existingOrder.setStatus(newStatus);
 
        // Save the updated order
        return orderRepository.save(existingOrder);
    }

}
