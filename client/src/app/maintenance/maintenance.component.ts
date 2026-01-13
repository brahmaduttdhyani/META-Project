import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
 
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  formModel:any={status:null}; 
  showError:boolean=false; 
  errorMessage:any; 
  hospitalList:any=[]; 
  assignModel: any={}; 
  itemForm!: FormGroup; 
  showMessage: any; 
  responseMessage: any; 
  maintenanceList: any=[]; 
  maintenanceObj: any={};
 
  constructor(){}
  ngOnInit(): void {
  }
 
  dateValidator() {}
  getMaintenance() {}
  viewDetails() {}
  edit() {}
  update() {}
}
 