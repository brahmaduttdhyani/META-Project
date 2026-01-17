package com.edutech.medicalequipmentandtrackingsystem.entitiy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "maintenances") // do not ch ange table name
public class Maintenance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //Primary key and Auto Increment 
    private Date scheduledDate; 
    private Date completedDate; 
    private String description; 
    private String status;  
    @ManyToOne 
    @JoinColumn(name = "equipment_id") 
    private Equipment equipment;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Date getScheduledDate() {
        return scheduledDate;
    }
    public void setScheduledDate(Date scheduledDate) {
        this.scheduledDate = scheduledDate;
    }
    public Date getCompletedDate() {
        return completedDate;
    }
    public void setCompletedDate(Date completedDate) {
        this.completedDate = completedDate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Equipment getEquipment() {
        return equipment;
    }
    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }  

    
}
