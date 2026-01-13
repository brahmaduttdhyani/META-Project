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

  showError: boolean = false;
  errorMessage: any;
  showMessage: any = false;
  responseMessage: any;
  orderList: any = [];
  statusModel: any = { newStatus: null };
  constructor(
    public router: Router,
    public httpService: HttpService,
    public authService: AuthService
  ) {
    if (
      authService.getRole != 'HOSPITAL' &&
      authService.getRole != 'SUPPLIER'
    ) {
      this.router.navigateByUrl('dashboard');
    }
  }
  ngOnInit(): void {
    this.getOrders();
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
          'An error occurred while fetching list. Please try again later.';
        //console.error('Error:', error);
      }
    );
  }

  edit(value: any) {
    this.statusModel.orderId = value.id;
    this.showMessage = false;
  }

  update() {
    if (this.statusModel.newStatus != null) {
      this.httpService
        .UpdateOrderStatus(this.statusModel.newStatus, this.statusModel.orderId)
        .subscribe(
          (data: any) => {
            this.showMessage = true;
            this.responseMessage = `Status updated`;
            this.getOrders();
          },
          (error) => {
            // Handle error
            this.showError = true;
            this.errorMessage =
              'An error occurred while updating status. Please try again later.';
          }
        );
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
 
 
 