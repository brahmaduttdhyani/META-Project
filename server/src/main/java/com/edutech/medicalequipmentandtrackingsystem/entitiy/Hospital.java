package com.edutech.medicalequipmentandtrackingsystem.entitiy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "hospital") // do not chan ge table name
public class Hospital {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //Primary key and Auto Increment 
    private String name; 
    private String location;
    private String createdBy;


    @OneToMany(mappedBy = "hospital") 
    @JsonIgnore 
    private List<Equipment> equipmentList;


    public String getCreatedBy() { return createdBy; }
public void setCreatedBy(String createdBy) { this.createdBy = createdBy; } 
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public List<Equipment> getEquipmentList() {
        return equipmentList;
    }
    public void setEquipmentList(List<Equipment> equipmentList) {
        this.equipmentList = equipmentList;
    } 

    
}
