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
 
itemForm!: FormGroup; 
formModel:any={role:null,email:'',password:'',username:''}; 
showMessage:boolean=false; 
responseMessage: any;
 
constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    // You can initialize form here or in ngOnInit
  }
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: [this.formModel.username, [Validators.required, Validators.minLength(3)]],
      email: [this.formModel.email, [
        Validators.required,
        Validators.email
      ]],
      password: [this.formModel.password, [
        Validators.required,
        Validators.minLength(6)
      ]],
      role: [this.formModel.role, Validators.required]
    });
  }
 
  onRegister(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
 
    this.showMessage = false;
    this.responseMessage = null;
 
    const registerData = {
      username: this.itemForm.get('username')?.value,
      email: this.itemForm.get('email')?.value,
      password: this.itemForm.get('password')?.value,
      role: this.itemForm.get('role')?.value
    };
 
    this.httpService.registerUser(registerData).subscribe({
      next: (response: any) => {
        this.showMessage = true;
        this.responseMessage = {
          type: 'success',
          text: response.message || 'Registration successful! Please login.'
        };
 
        // Optional: auto redirect to login after success
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.showMessage = true;
        this.responseMessage = {
          type: 'error',
          text: err.error?.message || 'Registration failed. Please try again.'
        };
        console.error('Registration error:', err);
      }
    });
  }
 
  // Optional helper methods
  get username() { return this.itemForm.get('username'); }
  get email() { return this.itemForm.get('email'); }
  get password() { return this.itemForm.get('password'); }
  get role() { return this.itemForm.get('role'); }
}