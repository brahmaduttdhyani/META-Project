import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
 
showError:boolean=false; 
errorMessage:any; 
showMessage: any; 
responseMessage: any; 
orderList: any=[]; 
statusModel:any={newStatus:null}
 
constructor(){}
ngOnInit(): void {
  throw new Error('Method not implemented.');
}
 
getOrders() {}
viewDetails() {}
edit() {}
update() {}
}