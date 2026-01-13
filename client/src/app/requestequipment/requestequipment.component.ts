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

itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  assignModel: any = {};
  orderList: any = [];
  showMessage: any;
  responseMessage: any;
  equipmentList: any = [];
  isClick: boolean = false;
  //creates a form group with following fields
  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      orderDate: [
        this.formModel.scheduledDate,
        [Validators.required, this.dateValidator],
      ],
      quantity: [this.formModel.description, [Validators.required]],
      status: [this.formModel.status, [Validators.required]],
      equipmentId: [this.formModel.equipmentId, [Validators.required]],
      hospitalId: [this.formModel.equipmentId, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getHospital();
    this.getOrders();
  }
  getHospital() {
    this.hospitalList = [];
    this.httpService.getHospital().subscribe(
      (data: any) => {
        this.hospitalList = data;
        console.log(this.hospitalList);
      },
      (error) => {
        // Handle error
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('Login error:', error);
      }
    );
  }
  //checks if date is in right pattern and selectedDate should be previous to today
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (!datePattern.test(control.value) || selectedDate < currentDate) {
      return { invalidDate: true };
    }

    return null;
  }
  onSubmit() {
    if (this.itemForm.valid) {
      if (this.itemForm.valid) {
        this.showError = false;
        //order equipment will take all the form value and only the value of eq id from the form
        this.httpService
          .orderEquipment(this.itemForm.value, this.itemForm.value.equipmentId)
          .subscribe(
            (data: any) => {
              //resets the form once the order is placed
              this.itemForm.reset();
              this.showMessage = true;
              //displays msg on clicking submit btn
              this.responseMessage = 'Ordered Successfully';
              //will display the orders
              this.getOrders();
            },
            (error) => {
              // Handle error
              this.showError = true;
              this.errorMessage =
                'An error occurred while requesting. Please try again later.';
            }
          );
      } else {
        this.itemForm.markAllAsTouched();
      }
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
  onHospitalSelect($event: any) {
    let id = $event.target.value;
    this.equipmentList = [];
    this.httpService.getEquipmentById(id).subscribe(
      (data: any) => {
        this.equipmentList = data;
        console.log(this.equipmentList);
      },
      (error) => {
        // Handle error
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }

  getOrders() {
    this.orderList = [];
    this.httpService.getorders().subscribe(
      (data: any) => {
        this.orderList = data;
        console.log(data);
      },
      (error) => {
        // Handle error
        this.showError = true;
        this.errorMessage =
          'An error occurred while logging in. Please try again later.';
        console.error('Login error:', error);
      }
    );
  }

  showStatus() {
    this.showMessage = false;
    if (this.isClick == false) {
      this.isClick = true;
      // this.router.navigate(['/requestequipment'], { fragment: 'div2' });
    } else {
      this.isClick = false;
      // this.router.navigate(['/requestequipment']);
    }
  }

  getStatusStyle(status: string) {
    if (status === 'Delivered') {
      return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
    } else if (status === 'In Transit') {
      return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
    } else {
      return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
    }
  }

}

