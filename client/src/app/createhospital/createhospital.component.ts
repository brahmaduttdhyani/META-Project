import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit {
  ////hii////
  itemForm!: FormGroup; 
  equipmentForm!: FormGroup; 
  formModel:any={status:null}; 
  showError:boolean=false; 
  errorMessage:any; 
  hospitalList:any=[]; //This variable used to store list of hospital information. 
  assignModel: any={}; 
  showMessage: any; 
  responseMessage: any; 
  
  constructor(){}

  ngOnInit(): void {
    
  }

  getHospital() {}

  onSubmit() {}
  
  Addequipment(value:any) {} 
  
  submitEquipment() {}
}
