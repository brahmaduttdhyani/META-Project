package com.edutech.medicalequipmentandtrackingsystem.service;

import java.util.List;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;

public interface OrderService {
    
    Order placeOrder(Long equipmentId, Order order); 
    List<Order> getAllOrders(String username); 
    Order updateOrderStatusSecured(Long orderId, String newStatus, String username);
     Order respondToOrder(Long orderId, String action, String username); 
     List<Order> getOrdersForSupplier(String username);
     Order cancelOrder(Long orderId);

}