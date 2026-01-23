package com.edutech.medicalequipmentandtrackingsystem.service.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Order placeOrder(Long equipmentId, Order order) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found with ID: " + equipmentId));

        order.setEquipment(equipment);
        order.setRequestStatus("PENDING");
        order.setAssignedSupplierId(null);
        order.setAssignedSupplierName(null);
        order.setStatus("Initiated");

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders(String username) {
        return orderRepository.findByEquipment_Hospital_CreatedBy(username);
    }

    @Override
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

    @Override
    public Order respondToOrder(Long orderId, String action, String username) {
        User supplier = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"SUPPLIER".equalsIgnoreCase(supplier.getRole())) {
            throw new RuntimeException("Only supplier can respond");
        }

        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("ACCEPT".equalsIgnoreCase(action)) {
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

        if ("REJECT".equalsIgnoreCase(action)) {
            return o;
        }

        throw new RuntimeException("Invalid action. Use ACCEPT or REJECT");
    }

    @Override
    public List<Order> getOrdersForSupplier(String username) {
        User supplier = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> pending = orderRepository.findByRequestStatusIgnoreCase("PENDING");
        pending.removeIf(o -> o.getStatus() != null && o.getStatus().equalsIgnoreCase("Cancelled"));

        List<Order> mine = orderRepository.findByAssignedSupplierId(supplier.getId());
        mine.removeIf(o -> o.getStatus() != null && o.getStatus().equalsIgnoreCase("Cancelled"));

        pending.addAll(mine);

        for (Order o : pending) {
            String requestedBy = null;
            if (o.getEquipment() != null && o.getEquipment().getHospital() != null) {
                requestedBy = o.getEquipment().getHospital().getCreatedBy();
            }
            o.setRequestedBy(requestedBy);
        }

        return pending;
    }

    @Override
    public Order cancelOrder(Long orderId) {
        Order existing = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String status = (existing.getStatus() == null) ? "" : existing.getStatus().toLowerCase();

        if (status.contains("transit") || status.contains("deliver") || status.contains("cancel")) {
            throw new RuntimeException("Order cannot be cancelled at this stage.");
        }

        existing.setStatus("Cancelled");
        existing.setRequestStatus("PENDING");
        existing.setAssignedSupplierId(null);
        existing.setAssignedSupplierName(null);

        return orderRepository.save(existing);
    }
}
