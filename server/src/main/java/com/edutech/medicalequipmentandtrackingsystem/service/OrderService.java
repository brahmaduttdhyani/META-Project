package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
 
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;
 
    public Order placeOrder(Long equipmentId, Order order) {
        // Check if the  equipment with the given ID exists
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found with ID: " + equipmentId));
 
        order.setEquipment(equipment);

        // For Accepting and Rejecting Order
        order.setRequestStatus("PENDING");
        order.setAssignedSupplierId(null);
        order.setAssignedSupplierName(null);

        order.setStatus("Initiated");
 
        // Save the order
        return orderRepository.save(order);
    }
 
    public List<Order> getAllOrders(String username) {
        return orderRepository.findByEquipment_Hospital_CreatedBy(username);
    }
 
    // public Order updateOrderStatus(Long orderId, String newStatus) {
    //     // Check if the order with the given ID exists
    //     Order existingOrder = orderRepository.findById(orderId)
    //             .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
 
    //     // Update the order status
    //     existingOrder.setStatus(newStatus);
 
    //     // Save the updated order
    //     return orderRepository.save(existingOrder);
    // }


    public Order updateOrderStatusSecured(Long orderId, String newStatus, String username) {
    User supplier = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Order existing = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if (!"ACCEPTED".equalsIgnoreCase(existing.getRequestStatus())) {
        throw new RuntimeException("Order not accepted yet");
    }

    if (existing.getAssignedSupplierId() == null || !existing.getAssignedSupplierId().equals(supplier.getId())) {
        throw new RuntimeException("You are not assigned to this order");
    }

    existing.setStatus(newStatus);
    return orderRepository.save(existing);
}



    // For Accepting and Rejecting Order
    public Order respondToOrder(Long orderId, String action, String username) {
    User supplier = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"SUPPLIER".equalsIgnoreCase(supplier.getRole())) {
        throw new RuntimeException("Only supplier can respond");
    }

    Order o = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if ("ACCEPT".equalsIgnoreCase(action)) {

        // block if accepted by another supplier
        if ("ACCEPTED".equalsIgnoreCase(o.getRequestStatus())
                && o.getAssignedSupplierId() != null
                && !o.getAssignedSupplierId().equals(supplier.getId())) {
            throw new RuntimeException("Already accepted by another supplier");
        }

        o.setRequestStatus("ACCEPTED");
        o.setAssignedSupplierId(supplier.getId());
        o.setAssignedSupplierName(supplier.getUsername());
        return orderRepository.save(o);
    }

    // REJECT will be handled locally in UI (like technician)
    if ("REJECT".equalsIgnoreCase(action)) {
        return o;
    }

    throw new RuntimeException("Invalid action. Use ACCEPT or REJECT");
}


// public List<Order> getOrdersForSupplier(String username) {
//     User supplier = userRepository.findByUsername(username)
//             .orElseThrow(() -> new RuntimeException("User not found"));

//     List<Order> pending = orderRepository.findByRequestStatusIgnoreCase("PENDING");
//     List<Order> mine = orderRepository.findByAssignedSupplierId(supplier.getId());

//     pending.addAll(mine);
//     return pending;
// }


public List<Order> getOrdersForSupplier(String username) {
    User supplier = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 1) Pending orders (but not cancelled)
    List<Order> pending = orderRepository.findByRequestStatusIgnoreCase("PENDING");
    pending.removeIf(o -> o.getStatus() != null && o.getStatus().equalsIgnoreCase("Cancelled"));

    // 2) Orders accepted by THIS supplier (but not cancelled)
    List<Order> mine = orderRepository.findByAssignedSupplierId(supplier.getId());
    mine.removeIf(o -> o.getStatus() != null && o.getStatus().equalsIgnoreCase("Cancelled"));

    pending.addAll(mine);

    for (Order o : pending) {
        String requestedBy = null;

        if (o.getEquipment() != null
                && o.getEquipment().getHospital() != null) {
            requestedBy = o.getEquipment().getHospital().getCreatedBy();
        }

        o.setRequestedBy(requestedBy);
    }

    return pending;
}

// ADD
public Order cancelOrder(Long orderId) {
    Order existing = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
 
    String status = (existing.getStatus() == null) ? "" : existing.getStatus().toLowerCase();
 
    // Block cancellation once in transit / delivered / already cancelled
    if (status.contains("transit") || status.contains("deliver") || status.contains("cancel")) {
        throw new RuntimeException("Order cannot be cancelled at this stage.");
    }
 
    existing.setStatus("Cancelled");

    existing.setRequestStatus("PENDING");
    existing.setAssignedSupplierId(null);
    existing.setAssignedSupplierName(null);
    // requestStatus can remain as is; business rule can adjust if needed
    return orderRepository.save(existing);
}


}
