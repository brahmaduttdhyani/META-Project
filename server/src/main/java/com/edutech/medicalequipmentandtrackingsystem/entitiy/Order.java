package com.edutech.medicalequipmentandtrackingsystem.entitiy;
 
import javax.persistence.*;

import java.util.Date;
 
@Entity

@Table(name = "orders") // do not ch ange table name

public class Order {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id; //Primary key and Auto Increment 

    private Date orderDate; 

    private String status; // Pending, Shipped, Delivered, etc. 

    private int quantity; 

    @ManyToOne 

    @JoinColumn(name = "equipment_id") 

    private Equipment equipment;
 
 
    @Transient

    private String requestedBy;
 
    public String getRequestedBy() {

        return requestedBy;

    }
 
    public void setRequestedBy(String requestedBy) {

        this.requestedBy = requestedBy;

    }

 
    // For accepting and rejecting Order

    private String requestStatus; // PENDING, ACCEPTED

    private Long assignedSupplierId;

    private String assignedSupplierName;    

    public String getRequestStatus() {

        return requestStatus;

    }

    public void setRequestStatus(String requestStatus) {

        this.requestStatus = requestStatus;

    }

    public Long getAssignedSupplierId() {

        return assignedSupplierId;

    }

    public void setAssignedSupplierId(Long assignedSupplierId) {

        this.assignedSupplierId = assignedSupplierId;

    }

    public String getAssignedSupplierName() {

        return assignedSupplierName;

    }

    public void setAssignedSupplierName(String assignedSupplierName) {

        this.assignedSupplierName = assignedSupplierName;

    }
 
 
    public Long getId() {

        return id;

    }

    public void setId(Long id) {

        this.id = id;

    }

    public Date getOrderDate() {

        return orderDate;

    }

    public void setOrderDate(Date orderDate) {

        this.orderDate = orderDate;

    }

    public String getStatus() {

        return status;

    }

    public void setStatus(String status) {

        this.status = status;

    }

    public int getQuantity() {

        return quantity;

    }

    public void setQuantity(int quantity) {

        this.quantity = quantity;

    }

    public Equipment getEquipment() {

        return equipment;

    }

    public void setEquipment(Equipment equipment) {

        this.equipment = equipment;

    }

 
    

}

 