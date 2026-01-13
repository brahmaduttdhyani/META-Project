package com.edutech.medicalequipmentandtrackingsystem.entitiy;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "hospital") // do not change table name
public class Hospital {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //Primary key and Auto Increment 
    private String name; 
    private String location; 
    @OneToMany(mappedBy = "hospital") 
    @JsonIgnore 
    private List<Equipment> equipmentList;
    
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
