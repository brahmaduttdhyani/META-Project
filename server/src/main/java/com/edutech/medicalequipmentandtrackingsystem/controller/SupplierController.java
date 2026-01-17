package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import java.util.List;

@RestController
public class SupplierController {

    @Autowired
    private OrderService orderService;
 
    @GetMapping("/api/supplier/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> a=orderService.getAllOrders();
        return new ResponseEntity<>(a,HttpStatus.OK);
        // get all order and return it status code 200 OK
    }
 
    @PutMapping("/api/supplier/order/update/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        Order b=orderService.updateOrderStatus(orderId, newStatus);
        return new  ResponseEntity<>(b,HttpStatus.OK);
        // update order s tatus and return updated order with status code 200 OK
    }  
}
