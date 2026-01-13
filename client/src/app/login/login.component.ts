import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  itemForm!: FormGroup; 
  formModel:any={}; 
  showError:boolean=false; 
  errorMessage:any; 
  
  constructor(){}

  ngOnInit(): void {
    
  }
 
  onLogin() {}
  registration() {}
}


