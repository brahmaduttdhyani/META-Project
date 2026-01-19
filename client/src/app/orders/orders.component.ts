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

  currentSupplierId: number = 0;

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
  // ngOnInit(): void {
    
  //   this.loadRejectedOrders();
    
  //   this.getOrders();
    
  // }

  ngOnInit(): void {
  const rawId = localStorage.getItem('userId');
  this.currentSupplierId = rawId ? parseInt(rawId, 10) : 0;

  this.loadRejectedOrders();
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


rejectedOrderIds: number[] = [];

private rejectedOrderKey(): string {
  const uname = (localStorage.getItem('username') || 'unknown').toLowerCase();
  return `rejectedOrders_${uname}`;
}

loadRejectedOrders() {
  const raw = localStorage.getItem(this.rejectedOrderKey());
  this.rejectedOrderIds = raw ? JSON.parse(raw) : [];
}

isOrderRejected(id: number): boolean {
  return this.rejectedOrderIds.includes(id);
}

rejectOrderLocally(id: number) {
  if (!this.rejectedOrderIds.includes(id)) {
    this.rejectedOrderIds.push(id);
    localStorage.setItem(this.rejectedOrderKey(), JSON.stringify(this.rejectedOrderIds));
  }
}

acceptOrder(orderId: number) {
  this.showError = false;
  this.showMessage = false;

  // clear local reject if any
  this.rejectedOrderIds = this.rejectedOrderIds.filter(x => x !== orderId);
  localStorage.setItem(this.rejectedOrderKey(), JSON.stringify(this.rejectedOrderIds));

  this.httpService.respondOrder(orderId, 'ACCEPT').subscribe(
    () => {
      this.showMessage = true;
      this.responseMessage = 'Order accepted';
      this.getOrders();
    },
    (err) => {
      this.showError = true;
      this.errorMessage = err?.error?.message || 'Failed to accept order';
    }
  );
}


canEditOrder(order: any): boolean {
  const req = (order.requestStatus || '').toString().trim().toUpperCase();
  const assigned = order.assignedSupplierId == null ? 0 : Number(order.assignedSupplierId);
  return req === 'ACCEPTED' && assigned === this.currentSupplierId && order.status !== 'Delivered';
}



}
 
 
 