import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit


{

  passwordStrength: string = '';
  passwordMessage:string='';
  emailReg:RegExp=/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,}$/;
 
  pMessage=`1) At least one lowercase alphabet i.e. [a-z]\n
  2) At least one uppercase alphabet i.e. [A-Z]\n
  3) At least one Numeric digit i.e. [0-9]\n
  4) At least one special character i.e. ['@', '$', '.', '#', '!', '%', '*', '?', '&', '^']\n
  5) The total length must be minimum of 8 \n`;
 
 
  strengthColors: { [key: string]: string } = {
    'Password is Required.':'red',
    'Weak': 'red',
    'Medium': 'orange',
    'Strong': 'green'
  };
  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' , confirmPassword: ''};
  showMessage: boolean = false;
  showError:boolean=false;
  responseMessage: any;
 
  constructor(public router: Router, private bookService: HttpService, private formBuilder: FormBuilder) {
 
    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username, Validators.required],
      password: [this.formModel.password, [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$.#!%*?&^])[a-zA-Z0-9@$.#!%*?&^]+$')]],
      confirmPassword: [this.formModel.confirmPassword, [Validators.required]],
      email: [this.formModel.email, [Validators.required,Validators.pattern(this.emailReg)]],
      role: [this.formModel.role, Validators.required]},
      { validators: this.checkPasswords }
      );
     
 
}
 
   ngOnInit(): void {
   }
 
 
  onRegister() {
 
    // Call the service to register the user
    this.bookService.registerUser(this.itemForm.value).subscribe(
      (response: any) => {
        this.showMessage = true;
        if(response==null){
          this.showError=false;
          this.responseMessage="User Already Exist";
        }else{
          if(this.itemForm.get('role')?.value==='HOSPITAL'){
            this.responseMessage ='Welcome '+this.itemForm.get('username')?.value+' to our page!!. You are an Admin now';
           //alert("Welcome "+this.itemForm.get('username')?.value)
            this.itemForm.reset();
          }
          else{
            this.responseMessage ='Welcome '+this.itemForm.get('username')?.value+' to our page!!. You are an '+this.itemForm.get('role')?.value+' now';
            //alert("Welcome "+this.itemForm.get('username')?.value)
            this.itemForm.reset();
          }
       
        }
      },
      (error: any) => {
        this.showError = true;
        this.responseMessage = 'An error occurred while registering.';
      }
    );
 
    console.log(this.itemForm.value);
  }
 
 
 
 
  // Custom validator function to check if password and confirmPassword match
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
 
    if (password !== confirmPassword || password==="") {
      group.get('confirmPassword')?.setErrors({ notSame: true });
    } else if(password===confirmPassword){
      group.get('confirmPassword')?.setErrors(null); // Clear error if passwords match
    }
  }
 
 
  checkPasswordStrength(): void {
    // Evaluate password strength based on criteria
    const password = this.itemForm.get('password')?.value;
    if (password === "") {
      this.passwordStrength = '';
      this.passwordMessage = '';
    } else if (password.length < 8) {
      this.passwordStrength = 'Weak'; // Password length out of range
      this.passwordMessage = this.pMessage;
    } else if (this.itemForm.get('password')?.hasError('pattern')) {
      this.passwordStrength = 'Medium'; // Missing one or more character types
      this.passwordMessage = this.pMessage;
    } else {
      this.passwordStrength = 'Strong'; // Password meets all criteria
      this.passwordMessage = '';
      console.log(this.passwordStrength);
    }
  }
 
}
