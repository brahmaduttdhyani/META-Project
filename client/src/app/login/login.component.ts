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
  
  itemForm: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username, [Validators.required]],
      password: [this.formModel.password, [Validators.required]],
    });
  }

  ngOnInit(): void {}
  //to valid ate the login 
  onLogin() {
    if (this.itemForm.valid) {
      this.showError = false;
      this.httpService.Login(this.itemForm.value).subscribe(
        (data: any) => {
          if (data.userNo != 0) {
            this.authService.SetRole(data.role);
            this.authService.SetUsername(data.username);
            this.authService.saveToken(data.token);

            // ✅ IMPORTANT: store userId for edit permission
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            localStorage.setItem('userId', String(payload.userId));

            this.router.navigateByUrl('/dashboard');

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
           else {
            this.showError = true;
            this.errorMessage = 'Wrong User or Password';
          }
        },
        (error) => {
          // Handle error
          this.showError = true;
          this.errorMessage =
            'The Username or Password you Enter is Incorrect.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
//to route to the registration
  registration() {
    this.router.navigateByUrl('/registration');
  }
}


