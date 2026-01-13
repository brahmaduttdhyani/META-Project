import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-requestequipment',
  templateUrl: './requestequipment.component.html',
  styleUrls: ['./requestequipment.component.scss']
})
export class RequestequipmentComponent implements OnInit{
 
itemForm!: FormGroup; 
formModel:any={status:null}; 
showError:boolean=false; 
errorMessage:any; 
hospitalList:any=[]; 
assignModel: any={}; 
showMessage: any; 
responseMessage: any; 
equipmentList: any=[];
 
constructor(){}
 
ngOnInit(): void {
  throw new Error('Method not implemented.');
}
 
getHospital() {}
dateValidator() {}
onSubmit() {}
onHospitalSelect() {}
}
 